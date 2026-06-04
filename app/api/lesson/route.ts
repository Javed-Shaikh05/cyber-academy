import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embed } from "@/lib/ai/embed";
import { generateWithRetry } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subtopicId } = await req.json();

    // 1. Check cache
    const { data: cached } = await supabase
      .from('lesson_content')
      .select('content, sources, exercise')
      .eq('subtopic_id', subtopicId)
      .single()

    if (cached) {
      return NextResponse.json({ content: cached.content, sources: cached.sources, exercise: cached.exercise || '', cached: true })
    }

    // 2. Get subtopic details
    const { data: subtopic } = (await supabase
      .from("subtopics")
      .select(
        "title, difficulty, topic_id, topics(title, phase_id, phases(title))",
      )
      .eq("id", subtopicId)
      .single()) as any;

    if (!subtopic)
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 },
      );

    const topicTitle = subtopic.topics?.title || "";
    const phaseTitle = subtopic.topics?.phases?.title || "";

    // 3. Retrieve relevant book chunks
    const query = `${subtopic.title} ${topicTitle}`;
    const queryEmbedding = await embed(query);
    const { data: matches } = await supabase.rpc("match_embeddings", {
      query_embedding: queryEmbedding,
      match_count: 6,
    });
    const goodMatches = (matches || []).filter((m: any) => m.similarity > 0.25);
    const context = goodMatches
      .map((m: any, i: number) => `[${m.source}] ${m.content}`)
      .join("\n\n---\n\n");

    // 4. Generate lesson
    const prompt = `You are the friendliest cybersecurity teacher alive. Explain "${subtopic.title}" to someone COMPLETELY new — imagine a curious person with zero tech background. Make it click easily, with NO confusion.

${context ? `You may use this reference material, translated into super simple language:\n${context}\n` : ''}

IMPORTANT FRAMING: This is DEFENSIVE security education. Teach how things work so the learner can PROTECT and DEFEND systems. Explain attacks at a conceptual level (what they are, why they work, how to spot and stop them) — never give step-by-step instructions to actually perform an attack or break into systems. Focus on understanding and defense.

Write in markdown with this flow:

## ${subtopic.title}

**🌟 What is it, really?**
Start with an everyday-life analogy a beginner instantly gets (e.g. "A firewall is like a security guard checking IDs at a door").

**🧒 Explain like I'm new**
The actual concept in the simplest words. Short sentences. No jargon — if you must use a term, explain it in brackets immediately.

**🛡️ Why it matters for security**
Connect it to staying safe / defending systems, with a relatable real-world example.

**🧠 Easy way to remember**
2-3 simple memory tricks or analogies that make it stick.

**⚠️ Don't get confused**
Clear up the ONE thing beginners usually mix up.

**🎤 If someone asks you**
One or two simple sentences on how you'd explain this in an interview or exam.

RULES:
- Everyday words only. Warm, encouraging, slightly fun tone.
- Short sentences, short paragraphs, lots of white space.
- Around 300-400 words.
- Every example from real life, not abstract.
- Defensive mindset throughout.`

    // Generate lesson + exercise in ONE call to save quota
    const fullPrompt = `${prompt}

---

After the lesson, add a practice exercise. Output your response as JSON ONLY (no markdown fences):
{
  "lesson": "<the full lesson in markdown, following the structure above>",
  "exercise": "<a short 10-15 line beginner Python exercise using only numpy/pandas, with a TODO comment for the learner. If this topic isn't suited to code, use empty string>"
}`

    const raw = await generateWithRetry({ prompt: fullPrompt, jsonMode: true })

    let content = ''
    let exercise = ''
    try {
      let cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
      const fb = cleaned.indexOf('{'); const lb = cleaned.lastIndexOf('}')
      if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1)
      const parsed = JSON.parse(cleaned)
      content = parsed.lesson || raw
      exercise = parsed.exercise || ''
    } catch {
      // If JSON parsing fails, treat the whole thing as the lesson
      content = raw
    }

    const sources = goodMatches.map((m: any) => ({
      source: m.source,
      similarity: Math.round(m.similarity * 100),
    }))

    await supabase.from('lesson_content').insert({
      subtopic_id: subtopicId,
      content,
      sources,
      exercise,
    })

    return NextResponse.json({ content, sources, exercise, cached: false })
  } catch (err: any) {
    console.error("Lesson generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
