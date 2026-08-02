import { TIERS, BESPOKE, FAQ } from '../../content'

/**
 * Talks to Munyakazi.
 *
 * The widget used to answer from a local keyword matcher in this file's place. It
 * no longer does: a matcher that picks the wrong FAQ entry answers a pricing
 * question with the wrong price and looks authoritative doing it. Questions go to
 * the service, which answers from the published knowledge base, or they don't get
 * answered at all.
 *
 * When the service is unreachable the widget DISPLAYS published content — prices
 * and the top questions, read straight from content.ts, the same source the page
 * renders. It shows; it does not guess.
 */

export type Message = {
  id: string
  role: 'assistant' | 'user'
  text: string
  /** Rendered as a link when the assistant hands over to a person. */
  whatsapp?: string
  /** Set when this is the offline card rather than an answer. */
  offline?: boolean
  prices?: string[]
  questions?: string[]
}

const ENDPOINT = import.meta.env.VITE_ASSISTANT_URL ?? ''
const API_KEY = import.meta.env.VITE_ASSISTANT_KEY ?? ''
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

const id = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/** Stable per browser tab, so the service can keep a short conversation window. */
function sessionId(): string {
  const KEY = 'briqx-assistant-session'
  let value = sessionStorage.getItem(KEY)
  if (!value) {
    value = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
    sessionStorage.setItem(KEY, value)
  }
  return value
}

function whatsappFallback(question: string): string | undefined {
  const number = WHATSAPP.replace(/\D/g, '')
  if (!number) return undefined
  const asked = question.trim().slice(0, 300)
  const text = asked
    ? `Hi briqx — I asked Munyakazi on your site: ${asked}`
    : 'Hi briqx — I have a question about your work.'
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

/** Published content to show when the service can't be reached. */
function offlineCard(question: string): Message {
  const prices = [
    ...TIERS.map(
      (t) => `${t.name} — ${t.price} RWF, live in ${t.timeline}`,
    ),
    ...BESPOKE.map((b) =>
      b.price ? `${b.name} — from ${b.price} RWF` : `${b.name} — ${b.note ?? 'quoted per project'}`,
    ),
  ]
  return {
    id: id('a'),
    role: 'assistant',
    text: "I can't reach my answering service right now. Here is what we publish, and you can reach a person on WhatsApp.",
    offline: true,
    prices,
    questions: FAQ.slice(0, 5).map((f) => f.q),
    whatsapp: whatsappFallback(question),
  }
}

export async function ask(question: string): Promise<Message> {
  if (!ENDPOINT) return offlineCard(question)

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
      },
      body: JSON.stringify({ session_id: sessionId(), text: question }),
    })

    // 429 still carries a usable body (throttle notice + handoff)
    if (!res.ok && res.status !== 429) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    if (data.offline) {
      return {
        id: id('a'),
        role: 'assistant',
        text: data.reply,
        offline: true,
        prices: data.prices ?? [],
        questions: data.questions ?? [],
        whatsapp: data.whatsapp ?? whatsappFallback(question),
      }
    }
    return {
      id: id('a'),
      role: 'assistant',
      text: data.reply ?? '',
      whatsapp: data.whatsapp ?? undefined,
    }
  } catch {
    return offlineCard(question)
  }
}

export const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: 'I am Munyakazi. Ask me anything about what we build, what it costs, or how long it takes — I answer from our published prices and FAQ.',
}

export const SUGGESTIONS = [
  'What does a website cost?',
  'How long does it take?',
  'Do I own everything?',
  'Can I pay in parts?',
]
