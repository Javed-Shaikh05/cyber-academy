import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TerminalView from './TerminalView'

export default async function TerminalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    return <TerminalView />
}