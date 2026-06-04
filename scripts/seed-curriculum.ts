import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { realtime: { transport: ws as any } }
)

const CURRICULUM = [
  {
    id: 'p1-foundations', title: 'Cybersecurity Foundations', icon: 'Shield', color: 'cyan',
    topics: [
      {
        id: 't1-understanding', title: 'Understanding Security',
        subtopics: [
          { id: 's-what-is-cyber', title: 'What is Cybersecurity?', difficulty: 'beginner' },
          { id: 's-why-matters', title: 'Why Security Matters', difficulty: 'beginner' },
          { id: 's-cia-triad', title: 'The CIA Triad', difficulty: 'beginner' },
          { id: 's-defender-mindset', title: 'Thinking Like a Defender', difficulty: 'beginner' },
        ],
      },
      {
        id: 't2-threat-landscape', title: 'The Threat Landscape',
        subtopics: [
          { id: 's-threat-actors', title: 'Who Are the Attackers?', difficulty: 'beginner' },
          { id: 's-attack-types', title: 'Common Types of Cyber Attacks', difficulty: 'beginner' },
          { id: 's-vuln-threat-risk', title: 'Vulnerabilities, Threats & Risks', difficulty: 'beginner' },
          { id: 's-cost-of-breach', title: 'The Real Cost of a Breach', difficulty: 'beginner' },
        ],
      },
    ],
  },
  {
    id: 'p2-networking', title: 'How Computers & Networks Work', icon: 'Network', color: 'violet',
    topics: [
      {
        id: 't3-net-basics', title: 'Networking Basics',
        subtopics: [
          { id: 's-how-internet-works', title: 'How the Internet Works', difficulty: 'beginner' },
          { id: 's-ip-dns', title: 'IP Addresses & DNS', difficulty: 'beginner' },
          { id: 's-ports-protocols', title: 'Ports & Protocols', difficulty: 'beginner' },
          { id: 's-osi-model', title: 'The OSI Model (Made Simple)', difficulty: 'intermediate' },
        ],
      },
      {
        id: 't4-net-security', title: 'Network Security',
        subtopics: [
          { id: 's-firewalls', title: 'Firewalls Explained', difficulty: 'beginner' },
          { id: 's-vpns', title: 'VPNs & Secure Connections', difficulty: 'beginner' },
          { id: 's-wifi-security', title: 'Wi-Fi Security', difficulty: 'beginner' },
          { id: 's-net-monitoring', title: 'Network Monitoring Basics', difficulty: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'p3-crypto', title: 'Cryptography & Data Protection', icon: 'Lock', color: 'pink',
    topics: [
      {
        id: 't5-encryption', title: 'Encryption Fundamentals',
        subtopics: [
          { id: 's-what-is-encryption', title: 'What is Encryption?', difficulty: 'beginner' },
          { id: 's-symmetric-asymmetric', title: 'Symmetric vs Asymmetric Encryption', difficulty: 'intermediate' },
          { id: 's-hashing', title: 'Hashing Explained', difficulty: 'beginner' },
          { id: 's-digital-signatures', title: 'Digital Signatures & Certificates', difficulty: 'intermediate' },
        ],
      },
      {
        id: 't6-secure-comms', title: 'Secure Communication',
        subtopics: [
          { id: 's-https-tls', title: 'How HTTPS Keeps You Safe', difficulty: 'beginner' },
          { id: 's-pki', title: 'Public Key Infrastructure (PKI)', difficulty: 'intermediate' },
          { id: 's-password-storage', title: 'Storing Passwords the Right Way', difficulty: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'p4-threats', title: 'Common Threats & How to Defend', icon: 'ShieldAlert', color: 'red',
    topics: [
      {
        id: 't7-malware-social', title: 'Malware & Social Engineering',
        subtopics: [
          { id: 's-malware-types', title: 'Types of Malware Explained', difficulty: 'beginner' },
          { id: 's-phishing', title: 'Phishing & How to Spot It', difficulty: 'beginner' },
          { id: 's-social-engineering', title: 'Social Engineering Tactics', difficulty: 'beginner' },
          { id: 's-ransomware', title: 'Ransomware: Threat & Defense', difficulty: 'intermediate' },
        ],
      },
      {
        id: 't8-attack-defense', title: 'Attack Techniques (Defensive View)',
        subtopics: [
          { id: 's-password-attacks', title: 'Password Attacks & Strong Auth', difficulty: 'intermediate' },
          { id: 's-mitm', title: 'Man-in-the-Middle Attacks', difficulty: 'intermediate' },
          { id: 's-dos', title: 'Denial of Service (DoS)', difficulty: 'intermediate' },
          { id: 's-insider-threats', title: 'Insider Threats', difficulty: 'beginner' },
        ],
      },
    ],
  },
  {
    id: 'p5-web-security', title: 'Web & Application Security', icon: 'Globe', color: 'green',
    topics: [
      {
        id: 't9-web-vulns', title: 'Web Vulnerabilities',
        subtopics: [
          { id: 's-how-sites-hacked', title: 'How Websites Get Hacked', difficulty: 'beginner' },
          { id: 's-sql-injection', title: 'SQL Injection & How to Defend', difficulty: 'intermediate' },
          { id: 's-xss', title: 'Cross-Site Scripting (XSS) Defense', difficulty: 'intermediate' },
          { id: 's-broken-auth', title: 'Broken Authentication & Sessions', difficulty: 'intermediate' },
        ],
      },
      {
        id: 't10-owasp', title: 'The OWASP Top 10',
        subtopics: [
          { id: 's-owasp-overview', title: 'OWASP Top 10 Overview', difficulty: 'beginner' },
          { id: 's-misconfig', title: 'Security Misconfiguration', difficulty: 'intermediate' },
          { id: 's-secure-coding', title: 'Secure Coding Principles', difficulty: 'intermediate' },
        ],
      },
    ],
  },
  {
    id: 'p6-defense', title: 'Defensive Security & Best Practices', icon: 'ShieldCheck', color: 'yellow',
    topics: [
      {
        id: 't11-protecting', title: 'Protecting Systems',
        subtopics: [
          { id: 's-mfa', title: 'Strong Passwords & MFA', difficulty: 'beginner' },
          { id: 's-patching', title: 'Patching & Updates', difficulty: 'beginner' },
          { id: 's-least-privilege', title: 'Principle of Least Privilege', difficulty: 'intermediate' },
          { id: 's-backups', title: 'Backups & Disaster Recovery', difficulty: 'beginner' },
        ],
      },
      {
        id: 't12-hygiene', title: 'Security Hygiene',
        subtopics: [
          { id: 's-endpoint', title: 'Endpoint Security', difficulty: 'beginner' },
          { id: 's-email-security', title: 'Email Security', difficulty: 'beginner' },
          { id: 's-awareness', title: 'Security Awareness', difficulty: 'beginner' },
        ],
      },
    ],
  },
  {
    id: 'p7-secops', title: 'Security Operations & Careers', icon: 'Radar', color: 'orange',
    topics: [
      {
        id: 't13-defending', title: 'Defending in the Real World',
        subtopics: [
          { id: 's-analyst-role', title: 'What Does a Security Analyst Do?', difficulty: 'beginner' },
          { id: 's-siem', title: 'SIEM & Security Monitoring', difficulty: 'intermediate' },
          { id: 's-incident-response', title: 'Incident Response Basics', difficulty: 'intermediate' },
          { id: 's-reading-logs', title: 'Reading Logs & Detecting Threats', difficulty: 'intermediate' },
        ],
      },
      {
        id: 't14-career', title: 'Your Security Career',
        subtopics: [
          { id: 's-career-paths', title: 'Security Roles & Career Paths', difficulty: 'beginner' },
          { id: 's-certifications', title: 'Key Certifications (Security+, CEH, CISSP)', difficulty: 'beginner' },
          { id: 's-home-lab', title: 'Building a Home Lab (Safely & Legally)', difficulty: 'intermediate' },
          { id: 's-ctf', title: 'Capture The Flag & Legal Practice', difficulty: 'beginner' },
        ],
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Seeding CyberAcademy curriculum...\n')

  // Clear existing (fresh start)
  await supabase.from('subtopics').delete().neq('id', '___')
  await supabase.from('topics').delete().neq('id', '___')
  await supabase.from('phases').delete().neq('id', '___')

  for (let pi = 0; pi < CURRICULUM.length; pi++) {
    const phase = CURRICULUM[pi]
    await supabase.from('phases').insert({
      id: phase.id, order_index: pi + 1, title: phase.title, icon: phase.icon, color: phase.color,
    })
    console.log(`📦 Phase ${pi + 1}: ${phase.title}`)

    for (let ti = 0; ti < phase.topics.length; ti++) {
      const topic = phase.topics[ti]
      await supabase.from('topics').insert({
        id: topic.id, phase_id: phase.id, order_index: ti + 1, title: topic.title,
      })

      for (let si = 0; si < topic.subtopics.length; si++) {
        const sub = topic.subtopics[si]
        await supabase.from('subtopics').insert({
          id: sub.id, topic_id: topic.id, order_index: si + 1,
          title: sub.title, difficulty: sub.difficulty,
        })
      }
      console.log(`   ✓ ${topic.title} (${topic.subtopics.length} lessons)`)
    }
  }

  console.log('\n🎉 Done! 7 phases, 14 topics, 55 lessons seeded.')
}

seed().catch(console.error)