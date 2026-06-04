'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Terminal, Wifi, Shield } from 'lucide-react'

// Simulated target systems (completely fictional / educational)
const SYSTEMS = {
    'web01.cyberlab.local': { ip: '10.0.1.10', os: 'Ubuntu 22.04', open_ports: [22, 80, 443], services: { 22: 'OpenSSH 8.9', 80: 'Apache 2.4.52', 443: 'Apache 2.4.52' } },
    'db01.cyberlab.local': { ip: '10.0.1.20', os: 'Ubuntu 20.04', open_ports: [22, 3306], services: { 22: 'OpenSSH 8.2', 3306: 'MySQL 8.0' } },
    'win-dc.cyberlab.local': { ip: '10.0.1.30', os: 'Windows Server 2019', open_ports: [445, 3389], services: { 445: 'SMBv3', 3389: 'RDP' } },
}

type Cmd = { input: string; output: string; type?: 'info' | 'warn' | 'error' | 'success' }

const HELP = `
Available Commands:
──────────────────────────────────────────────
  help              Show this help
  clear             Clear the terminal
  whoami            Show current user
  ifconfig          Show network interfaces
  ping <host>       Ping a host
  nmap <host>       Scan open ports (simulated)
  scan <host>       Alias for nmap
  whois <host>      WHOIS lookup (simulated)
  connect <host>    Attempt SSH connection
  analyze <log>     Analyze a log entry
  hash <text>       Show hash of text (educational)
  encode <text>     Base64 encode text
  decode <text>     Base64 decode text
  explain <topic>   Explain a security concept
  targets           List available lab targets
  status            Show lab environment status

⚠️  This is a SIMULATED educational environment.
    All targets are fictional. No real systems involved.
──────────────────────────────────────────────`

function simHash(text: string): string {
    // Simple educational hash display (not real crypto)
    let h = 0
    for (let i = 0; i < text.length; i++) h = Math.imul(31, h) + text.charCodeAt(i) | 0
    const hex = Math.abs(h).toString(16).padStart(8, '0')
    // Show as if it's multiple hash types
    return `MD5:    ${hex}${hex}${hex}${hex}\nSHA1:   ${hex}${hex}${hex}${hex}${hex}\nSHA256: ${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`
}

function processCommand(cmd: string, history: Cmd[]): Cmd {
    const parts = cmd.trim().split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (command) {
        case 'help':
            return { input: cmd, output: HELP, type: 'info' }

        case 'clear':
            return { input: cmd, output: '__CLEAR__' }

        case 'whoami':
            return { input: cmd, output: 'analyst@cyberlab  [role: junior-analyst]  [clearance: TRAINEE]', type: 'success' }

        case 'ifconfig':
            return {
                input: cmd,
                output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>
      inet 10.0.0.5  netmask 255.255.255.0  broadcast 10.0.0.255
      ether 00:1a:2b:3c:4d:5e  txqueuelen 1000

lo:   flags=73<UP,LOOPBACK,RUNNING>
      inet 127.0.0.1  netmask 255.0.0.0`,
                type: 'info',
            }

        case 'ping': {
            const host = args[0]
            if (!host) return { input: cmd, output: 'Usage: ping <hostname or IP>', type: 'error' }
            const target = Object.entries(SYSTEMS).find(([name, s]) => name === host || s.ip === host)
            if (target) {
                return {
                    input: cmd,
                    output: `PING ${host} (${target[1].ip}): 56 bytes of data
64 bytes from ${target[1].ip}: icmp_seq=0 ttl=64 time=0.421 ms
64 bytes from ${target[1].ip}: icmp_seq=1 ttl=64 time=0.389 ms
64 bytes from ${target[1].ip}: icmp_seq=2 ttl=64 time=0.412 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`,
                    type: 'success',
                }
            }
            return {
                input: cmd,
                output: `PING ${host}: Request timeout for icmp_seq 0\nRequest timeout for icmp_seq 1\nHost unreachable or does not exist in lab.`,
                type: 'warn',
            }
        }

        case 'nmap':
        case 'scan': {
            const host = args[0]
            if (!host) return { input: cmd, output: 'Usage: nmap <hostname or IP>', type: 'error' }
            const target = Object.entries(SYSTEMS).find(([name, s]) => name === host || s.ip === host)
            if (!target) return { input: cmd, output: `Host ${host} not found in lab environment.\nUse 'targets' to see available hosts.`, type: 'warn' }

            const [name, sys] = target
            const portLines = sys.open_ports.map(p =>
                `${p}/tcp   open   ${(sys.services as any)[p]}`
            ).join('\n')

            return {
                input: cmd,
                output: `Starting CyberAcademy Nmap Simulation v1.0
Scanning ${name} (${sys.ip})...

PORT     STATE  SERVICE
${portLines}

OS Detection: ${sys.os}
Scan complete. ${sys.open_ports.length} open ports found.

💡 LEARNING NOTE: In real environments, port scanning without permission
   is illegal. Always get written authorization first.`,
                type: 'info',
            }
        }

        case 'targets':
            return {
                input: cmd,
                output: `Available Lab Targets:
─────────────────────────────────────────────
  HOST                    IP           OS
  web01.cyberlab.local    10.0.1.10    Ubuntu 22.04
  db01.cyberlab.local     10.0.1.20    Ubuntu 20.04
  win-dc.cyberlab.local   10.0.1.30    Windows Server 2019

These are SIMULATED targets for educational purposes.`,
                type: 'info',
            }

        case 'whois': {
            const host = args[0]
            if (!host) return { input: cmd, output: 'Usage: whois <domain>', type: 'error' }
            return {
                input: cmd,
                output: `WHOIS lookup: ${host}
─────────────────────────────────────────────
Domain:    ${host}
Registrar: CyberLab Simulated Registry
Created:   2024-01-01
Updated:   2024-06-01
Expires:   2025-01-01
Status:    active

Name Servers:
  ns1.cyberlab.local
  ns2.cyberlab.local

💡 LEARNING NOTE: Real WHOIS reveals domain registration details.
   Attackers use this for reconnaissance. Defenders monitor WHOIS
   for unauthorized domain registrations (typosquatting).`,
                type: 'info',
            }
        }

        case 'connect': {
            const host = args[0]
            if (!host) return { input: cmd, output: 'Usage: connect <hostname>', type: 'error' }
            const target = Object.entries(SYSTEMS).find(([name, s]) => name === host || s.ip === host)
            if (!target) return { input: cmd, output: `Cannot connect: ${host} not found in lab.`, type: 'error' }
            const hasSSH = target[1].open_ports.includes(22)
            if (!hasSSH) {
                return { input: cmd, output: `ssh: connect to host ${host} port 22: Connection refused\nSSH is not running on this target.`, type: 'error' }
            }
            return {
                input: cmd,
                output: `Attempting SSH to ${host}...
ssh analyst@${host}
Permission denied (publickey,password).

💡 LEARNING NOTE: Failed authentication is normal and expected without
   valid credentials. Always authenticate only to systems you own or
   have explicit written permission to access.`,
                type: 'warn',
            }
        }

        case 'hash': {
            const text = args.join(' ')
            if (!text) return { input: cmd, output: 'Usage: hash <text>', type: 'error' }
            return {
                input: cmd,
                output: `Input:  "${text}"

${simHash(text)}

💡 LEARNING NOTE: Hashing is one-way — you cannot reverse a hash to get
   the original text. This is why passwords are stored as hashes.
   If two inputs produce the same hash = "collision" (a weakness).`,
                type: 'info',
            }
        }

        case 'encode': {
            const text = args.join(' ')
            if (!text) return { input: cmd, output: 'Usage: encode <text>', type: 'error' }
            try {
                const encoded = btoa(text)
                return {
                    input: cmd,
                    output: `Input:   "${text}"\nBase64:  ${encoded}\n\n💡 Base64 is ENCODING, not encryption. Anyone can decode it.`,
                    type: 'info',
                }
            } catch {
                return { input: cmd, output: 'Error encoding text.', type: 'error' }
            }
        }

        case 'decode': {
            const text = args.join(' ')
            if (!text) return { input: cmd, output: 'Usage: decode <text>', type: 'error' }
            try {
                const decoded = atob(text)
                return {
                    input: cmd,
                    output: `Base64:  "${text}"\nDecoded: ${decoded}\n\n💡 This is why Base64 is NOT a security measure — it's trivially reversible.`,
                    type: 'info',
                }
            } catch {
                return { input: cmd, output: 'Invalid Base64 input.', type: 'error' }
            }
        }

        case 'analyze': {
            const entry = args.join(' ')
            if (!entry) return { input: cmd, output: 'Usage: analyze <log entry or IP>', type: 'error' }
            const isSuspiciousIP = /185\.|91\.|45\.33/.test(entry)
            const hasError = /40[0-9]|50[0-9]/.test(entry)
            const hasSQLi = /union|select|insert|drop|1=1|'--/.test(entry.toLowerCase())
            const findings: string[] = []
            if (isSuspiciousIP) findings.push('⚠️  IP matches known threat intelligence ranges')
            if (hasSQLi) findings.push('🚨 Possible SQL injection attempt detected')
            if (hasError) findings.push('ℹ️  HTTP error codes present — possible scanning or bad requests')
            if (findings.length === 0) findings.push('✅ No immediate red flags detected in this entry')
            return {
                input: cmd,
                output: `Log Analysis Results:\n─────────────────────\n${findings.join('\n')}\n\nEntry: ${entry}`,
                type: hasSQLi ? 'error' : hasError ? 'warn' : 'success',
            }
        }

        case 'explain': {
            const topic = args.join(' ').toLowerCase()
            const explanations: Record<string, string> = {
                'firewall': 'A firewall filters network traffic based on rules. Like a security guard — allows known-good traffic, blocks known-bad.',
                'vpn': 'A VPN encrypts your traffic and hides your IP. All data passes through an encrypted tunnel to the VPN server first.',
                'xss': 'Cross-Site Scripting: attacker injects malicious scripts into a web page that other users see. Defense: sanitize all user input.',
                'sql injection': 'Attacker inserts SQL commands into an input field to manipulate the database. Defense: use parameterized queries, never string concatenation.',
                'phishing': 'Fake emails/sites that trick users into giving credentials. Defense: check sender domain, hover links before clicking, use MFA.',
                'mfa': 'Multi-Factor Authentication: something you know (password) + something you have (phone). Stops 99%+ of password attacks.',
                'encryption': 'Transforms readable data into unreadable cipher. Only someone with the key can decrypt. Like a locked box only you can open.',
                'hash': 'One-way function: input → fixed-size output. Same input always gives same hash. Used for password storage and integrity checking.',
                'port': 'A virtual door on a computer. Port 80 = HTTP, 443 = HTTPS, 22 = SSH. Open ports are potential entry points.',
                'cia triad': 'Confidentiality (only right people see data), Integrity (data not tampered with), Availability (systems stay online). The 3 pillars of security.',
            }
            const found = Object.entries(explanations).find(([key]) => topic.includes(key))
            if (found) {
                return { input: cmd, output: `📖 ${found[0].toUpperCase()}\n─────────────────────\n${found[1]}`, type: 'info' }
            }
            return {
                input: cmd,
                output: `No explanation found for "${args.join(' ')}". Try: firewall, vpn, xss, sql injection, phishing, mfa, encryption, hash, port, cia triad`,
                type: 'warn',
            }
        }

        case 'status':
            return {
                input: cmd,
                output: `CyberAcademy Lab Status
─────────────────────────────────────────────
  Environment:  SIMULATED (safe, educational)
  Network:      10.0.0.0/24
  Your IP:      10.0.0.5
  Targets:      3 hosts online
  Mode:         DEFENSIVE TRAINING
  Session:      ACTIVE

  ⚠️  All activity is for LEARNING ONLY.
      No real systems. No real attacks.`,
                type: 'success',
            }

        case '':
            return { input: '', output: '' }

        default:
            return {
                input: cmd,
                output: `Command not found: ${command}\nType 'help' to see available commands.`,
                type: 'error',
            }
    }
}

export default function TerminalView() {
    const [history, setHistory] = useState<Cmd[]>([
        {
            input: '',
            output: `CyberAcademy Security Terminal v1.0
─────────────────────────────────────────────
  SIMULATED ENVIRONMENT — Safe & Educational
  Type 'help' to see available commands.
  Type 'targets' to see lab systems.
─────────────────────────────────────────────`,
            type: 'info',
        },
    ])
    const [input, setInput] = useState('')
    const [cmdHistory, setCmdHistory] = useState<string[]>([])
    const [histIndex, setHistIndex] = useState(-1)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [history])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const run = (cmd: string) => {
        const result = processCommand(cmd, history)

        if (result.output === '__CLEAR__') {
            setHistory([])
            setInput('')
            return
        }

        if (cmd.trim()) {
            setCmdHistory((h) => [cmd, ...h].slice(0, 50))
        }

        setHistory((h) => [...h, result])
        setInput('')
        setHistIndex(-1)
    }

    const outputColor = (type?: string) => {
        switch (type) {
            case 'error': return 'text-[var(--cyber-red)]'
            case 'warn': return 'text-[var(--cyber-yellow)]'
            case 'success': return 'text-[var(--cyber-green)]'
            default: return 'text-[#9ecf9e]'
        }
    }

    return (
        <main className="flex flex-col h-dvh max-w-5xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--cyber-border)] bg-black/60 backdrop-blur-xl shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#5a8a5a] hover:text-[var(--cyber-green)] transition text-xs font-mono">
                    <ArrowLeft className="w-4 h-4" /> /dashboard
                </Link>
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[var(--cyber-green)]" />
                    <span className="font-mono text-sm font-bold text-[var(--cyber-green)]">CYBERLAB TERMINAL</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#5a8a5a]">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-[var(--cyber-green)]" /> 10.0.0.5</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[var(--cyber-green)]" /> TRAINEE</span>
                </div>
            </header>

            {/* Terminal output */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4 font-mono text-xs sm:text-sm space-y-1 min-h-0 cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((h, i) => (
                    <div key={i}>
                        {h.input && (
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[var(--cyber-green)] shrink-0">analyst@cyberlab:~$</span>
                                <span className="text-white">{h.input}</span>
                            </div>
                        )}
                        {h.output && (
                            <pre className={`whitespace-pre-wrap leading-relaxed ${outputColor(h.type)} pl-2 border-l border-[var(--cyber-border)] ml-1 mt-0.5`}>
                                {h.output}
                            </pre>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--cyber-border)] bg-black/60 shrink-0">
                <span className="font-mono text-[var(--cyber-green)] text-xs sm:text-sm shrink-0 whitespace-nowrap">
                    analyst@cyberlab:~$
                </span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            run(input)
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault()
                            const next = Math.min(histIndex + 1, cmdHistory.length - 1)
                            setHistIndex(next)
                            setInput(cmdHistory[next] || '')
                        } else if (e.key === 'ArrowDown') {
                            e.preventDefault()
                            const next = Math.max(histIndex - 1, -1)
                            setHistIndex(next)
                            setInput(next === -1 ? '' : cmdHistory[next])
                        } else if (e.key === 'Tab') {
                            e.preventDefault()
                            // Tab completion for commands
                            const commands = ['help', 'clear', 'whoami', 'ifconfig', 'ping', 'nmap', 'scan', 'whois', 'connect', 'analyze', 'hash', 'encode', 'decode', 'explain', 'targets', 'status']
                            const match = commands.find((c) => c.startsWith(input.toLowerCase()))
                            if (match) setInput(match)
                        } else if (e.key === 'l' && e.ctrlKey) {
                            e.preventDefault()
                            setHistory([])
                        }
                    }}
                    className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white focus:outline-none caret-[var(--cyber-green)]"
                    placeholder="type a command..."
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="off"
                />
                <span className="cursor-blink text-[var(--cyber-green)] font-mono">█</span>
            </div>
        </main>
    )
}