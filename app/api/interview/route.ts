import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry } from "@/lib/ai/gemini";

interface Question {
  question: string;
  answer: string | null;
  feedback: string | null;
  score: number | null;
}

interface Track {
  name: string;
  description: string;
  questionCount: number;
}

const TRACKS: Record<string, Track> = {
  security_fundamentals: {
    name: 'Security Fundamentals',
    description: 'CIA triad, threat landscape, basic concepts',
    questionCount: 5,
  },
  network_security: {
    name: 'Network Security',
    description: 'Firewalls, VPNs, protocols, network attacks',
    questionCount: 5,
  },
  web_security: {
    name: 'Web & App Security',
    description: 'OWASP Top 10, XSS, SQL injection defense',
    questionCount: 5,
  },
  cryptography: {
    name: 'Cryptography',
    description: 'Encryption, hashing, PKI, TLS/HTTPS',
    questionCount: 5,
  },
};

// ACTION: start — creates interview, returns first question
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, interviewId, track, difficulty, answer } = await req.json();

    // ── START ──
    if (action === "start") {
      const trackConfig = TRACKS[track] || TRACKS.security_fundamentals;
      const prompt = `You are a cybersecurity hiring manager interviewing a junior security analyst candidate.

INTERVIEW TRACK: ${trackConfig.name}
FOCUS: ${trackConfig.description}

Ask ${trackConfig.questionCount} interview questions. Mix conceptual understanding, real-world scenarios, and "how would you defend against X" questions.

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "<interview question>",
      "type": "open",
      "hint": "<what a good answer should cover>"
    }
  ]
}`;

      const raw = await generateWithRetry({ prompt, jsonMode: true });

      let allQuestions: Array<{ question: string }> = [];
      try {
        let cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
        const fb = cleaned.indexOf('{'); const lb = cleaned.lastIndexOf('}');
        if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1);
        const parsed = JSON.parse(cleaned);
        allQuestions = (parsed.questions || []).map((q: any) => ({ question: q.question }));
      } catch {
        allQuestions = [{ question: raw.trim() }];
      }

      const dbQuestions: Question[] = allQuestions.map((q) => ({
        question: q.question,
        answer: null,
        feedback: null,
        score: null,
      }));

      const { data: interview, error: insertError } = await supabase
        .from("interviews")
        .insert({ user_id: user.id, track, difficulty, questions: dbQuestions })
        .select()
        .single();

      if (insertError) {
        console.error("Interview insert failed:", insertError);
        return NextResponse.json({ error: `DB insert failed: ${insertError.message}` }, { status: 500 });
      }
      if (!interview)
        return NextResponse.json({ error: "Failed to create interview" }, { status: 500 });

      return NextResponse.json({
        interviewId: interview.id,
        question: dbQuestions[0].question,
        questionNumber: 1,
      });
    }

    // ── ANSWER ── (score the answer, return feedback + next question)
    if (action === "answer") {
      const { data: interview } = await supabase
        .from("interviews")
        .select("*")
        .eq("id", interviewId)
        .eq("user_id", user.id)
        .single();

      if (!interview)
        return NextResponse.json(
          { error: "Interview not found" },
          { status: 404 },
        );

      const questions = interview.questions as Question[];
      const currentIdx = questions.findIndex((q) => q.answer === null);
      const currentQ = questions[currentIdx];
      const trackConfig = TRACKS[interview.track] || TRACKS.security_fundamentals;
      const nextStored = questions[currentIdx + 1] ?? null;

      // Score the answer + optionally return next stored question
      const evalText = await generateWithRetry({
        jsonMode: true,
        prompt: `You are a cybersecurity hiring manager evaluating a junior analyst candidate.

TRACK: ${trackConfig.name} — ${trackConfig.description}
QUESTION: ${currentQ.question}
CANDIDATE'S ANSWER: ${answer}

Evaluate the answer and respond ONLY with valid JSON:
{
  "score": <0-10 integer>,
  "feedback": "<2-3 sentences: what was strong, what was missing, what a hiring manager would think>"
}

Be honest but constructive.`,
      });

      let cleaned = evalText
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
      const fb = cleaned.indexOf("{");
      const lb = cleaned.lastIndexOf("}");
      if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1);
      const evalResult = JSON.parse(cleaned);

      questions[currentIdx] = {
        ...currentQ,
        answer,
        feedback: evalResult.feedback,
        score: evalResult.score,
      };

      const isLast = !nextStored;

      await supabase
        .from("interviews")
        .update({ questions })
        .eq("id", interviewId);

      return NextResponse.json({
        feedback: evalResult.feedback,
        score: evalResult.score,
        nextQuestion: isLast ? null : nextStored.question,
        questionNumber: currentIdx + 2,
        isLast,
      });
    }

    // ── FINISH ── (generate overall report)
    if (action === "finish") {
      const { data: interview } = await supabase
        .from("interviews")
        .select("*")
        .eq("id", interviewId)
        .eq("user_id", user.id)
        .single();

      if (!interview)
        return NextResponse.json(
          { error: "Interview not found" },
          { status: 404 },
        );

      const questions = (interview.questions as Question[]).filter(
        (q) => q.answer !== null,
      );
      const avgScore = Math.round(
        (questions.reduce((s, q) => s + (q.score || 0), 0) / questions.length) *
          10,
      );

      const transcript = questions
        .map(
          (q, i) =>
            `Q${i + 1}: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.score}/10`,
        )
        .join("\n\n");

      const summaryText = await generateWithRetry({
        jsonMode: true,
        prompt: `Review this complete cybersecurity analyst mock interview transcript and give an honest hiring assessment.

${transcript}

Respond ONLY with valid JSON:
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "hire_verdict": "<one of: 'Strong Hire', 'Hire', 'Lean Hire', 'No Hire'> — with one sentence why",
  "advice": "<2-3 sentences of actionable advice for next time>"
}`,
      });

      let cleaned = summaryText
        .replace(/```json\s*/gi, "")
        .replace(/```/g, "")
        .trim();
      const fb = cleaned.indexOf("{");
      const lb = cleaned.lastIndexOf("}");
      if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1);

      let summary;
      try {
        summary = JSON.parse(cleaned);
      } catch {
        console.error("Summary JSON parse failed. Raw:", cleaned);
        // Fallback summary so the interview still completes
        summary = {
          strengths: ["You completed the full interview"],
          weaknesses: ["Report generation had a hiccup — try another round"],
          hire_verdict: "Lean Hire — review your answers above",
          advice:
            "Your per-question feedback above is still accurate. Try another interview for a fresh assessment.",
        };
      }

      await supabase
        .from("interviews")
        .update({
          status: "completed",
          overall_score: avgScore,
          summary,
          completed_at: new Date().toISOString(),
        })
        .eq("id", interviewId);

      // Award XP
      await supabase.from("xp_events").insert({
        user_id: user.id,
        amount: 100,
        reason: "interview_complete",
        metadata: { interview_id: interviewId, score: avgScore },
      });
      const { data: stats } = await supabase
        .from("user_stats")
        .select("total_xp")
        .eq("user_id", user.id)
        .single();
      if (stats) {
        await supabase
          .from("user_stats")
          .update({ total_xp: stats.total_xp + 100 })
          .eq("user_id", user.id);
      }

      return NextResponse.json({ overall_score: avgScore, summary, questions });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Interview error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
