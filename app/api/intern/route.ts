import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWithRetry } from '@/lib/ai/gemini'
import { getDataset } from '@/lib/datasets/samples'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { action } = body

        // ── BRIEF: generate the intern task ──
        if (action === 'brief') {
            const { datasetId } = body
            const ds = getDataset(datasetId)
            if (!ds) return NextResponse.json({ error: 'Dataset not found' }, { status: 404 })

            const prompt = `You are a cybersecurity team lead assigning an analysis task to a junior security analyst intern.

DATASET: "${ds.name}" (${ds.domain})
DATA DESCRIPTION: ${ds.description}
SCENARIO: ${ds.scenario}

Create a realistic security analysis brief. Respond ONLY with valid JSON:
{
  "title": "<mission title e.g. 'Investigate Suspicious Login Activity'>",
  "scenario": "<2-3 sentences: the security incident and what the analyst needs to do>",
  "tasks": [
    "<task 1 — load and explore the data>",
    "<task 2 — identify specific suspicious patterns>",
    "<task 3 — quantify the threat>",
    "<task 4 — write your findings/recommendations>"
  ],
  "hint": "<one tip about what to look for in this specific dataset>"
}`

            const raw = await generateWithRetry({ prompt, jsonMode: true, temperature: 0.6 })
            let cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
            const fb = cleaned.indexOf('{'); const lb = cleaned.lastIndexOf('}')
            if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1)

            let brief
            try { brief = JSON.parse(cleaned) } catch {
                return NextResponse.json({ error: 'Could not generate brief. Try again.' }, { status: 500 })
            }

            const { data: saved } = await supabase
                .from('intern_projects')
                .insert({ user_id: user.id, dataset_id: datasetId, brief, status: 'in_progress' })
                .select()
                .single()

            return NextResponse.json({ projectId: saved!.id, brief })
        }

        // ── REVIEW: grade the intern's code ──
        if (action === 'review') {
            const { projectId, code, output } = body

            const { data: project } = await supabase
                .from('intern_projects')
                .select('*')
                .eq('id', projectId)
                .eq('user_id', user.id)
                .single()

            if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

            const brief = project.brief as any

            const prompt = `You are a cybersecurity team lead reviewing a junior analyst's investigation.

MISSION: ${brief.title}
SCENARIO: ${brief.scenario}
TASKS ASSIGNED: ${brief.tasks.join(', ')}

ANALYST'S CODE:
${code}

CODE OUTPUT:
${output}

Review their work and respond ONLY with valid JSON:
{
  "score": <0-100>,
  "manager_note": "<1-2 sentences overall impression>",
  "what_went_well": ["...", "..."],
  "improvements": ["...", "..."]
}

Be encouraging — they're learning. Give 2-3 items per list.`

            const raw = await generateWithRetry({ prompt, jsonMode: true, temperature: 0.5 })
            let cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
            const fb = cleaned.indexOf('{'); const lb = cleaned.lastIndexOf('}')
            if (fb !== -1) cleaned = cleaned.slice(fb, lb + 1)

            let review
            try { review = JSON.parse(cleaned) } catch {
                return NextResponse.json({ error: 'Could not generate review. Try again.' }, { status: 500 })
            }

            await supabase.from('intern_projects')
                .update({ user_code: code, review, status: 'completed' })
                .eq('id', projectId)

            // Award XP
            await supabase.from('xp_events').insert({ user_id: user.id, amount: 100, reason: 'intern_project' })
            const { data: stats } = await supabase.from('user_stats').select('total_xp').eq('user_id', user.id).single()
            if (stats) await supabase.from('user_stats').update({ total_xp: stats.total_xp + 100 }).eq('user_id', user.id)

            return NextResponse.json({ review })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
        console.error('Intern error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}