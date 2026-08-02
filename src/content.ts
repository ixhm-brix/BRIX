/**
 * All site copy. Edit here, not in layout.
 *
 * Every claim below follows from the published prices and terms. Nothing here invents
 * client counts, years in business, or a mission statistic — if you want a number on
 * this page, it has to be one you can show someone.
 */

export const BRAND = {
  name: 'briqx',
  tagline: 'Software studio',
  place: 'Kigali, Rwanda',
}

export const NAV = [
  { label: 'What we build', href: '#build' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How it goes', href: '#schedule' },
  { label: 'Questions', href: '#faq' },
]

export const HERO = {
  headline: {
    lead: 'Built in weeks.',
    accent: 'Yours from day one.',
  },
  /** One line, not a paragraph. The capability strip below carries the detail. */
  subtext: 'Websites, online stores and software for Rwandan business.',
  primaryCta: 'Tell us what you need',
  secondary: [
    { label: 'See the prices', href: '#pricing' },
    { label: 'See what we build', href: '#build' },
  ],
  /** The three questions every buyer asks first, answered before they ask. */
  terms: [
    { label: 'Starts at', value: '400,000', unit: 'RWF', note: 'published, never “it depends”' },
    { label: 'Live in', value: '1–3', unit: 'weeks', note: 'written into the agreement' },
    { label: 'You keep', value: 'All of it', unit: '', note: 'domain · code · accounts' },
  ],
}

export const MANIFESTO = {
  label: 'Where we stand',
  headline: { lead: '“It depends”', accent: 'is not a price.' },
  claims: [
    { key: 'Published', body: 'Every price we charge is on this page. You do not need a meeting to find out what something costs.' },
    { key: 'Written', body: 'Your date goes into the agreement. A commitment, not an estimate.' },
    { key: 'In your name', body: 'Domain, hosting and Google account registered to you on day one — not handed over at the end.' },
    { key: 'No lock-in', body: 'Leave whenever you like. You take all of it and nothing stops working.' },
  ],
}

/**
 * The assistant. "Munyakazi" is Kinyarwanda for the one who works — a fitting name for
 * something that answers at any hour. The hail is what it says unprompted on every load.
 */
export const ASSISTANT = {
  name: 'Munyakazi',
  role: 'Answers from our prices & FAQ',
  /** One line only — this is a tap target, not the conversation. The fuller welcome
   * lives in GREETING, inside the panel, where there is room for it. */
  hail: 'Need a hand? Ask Munyakazi.',
}

export const SCHEDULE = {
  label: 'How it goes',
  headline: { lead: 'A date, not', accent: 'an estimate.' },
  note: 'Packaged builds run to a fixed calendar. You know the finish line before you pay the first half.',
  /**
   * Delivery windows, straight off the price sheet. Rendered as one block per week —
   * not as a bar in a track, which would imply progress toward some maximum and read
   * backwards, since fewer weeks is the better outcome.
   */
  windows: [
    { name: 'Launch', weeks: 1 },
    { name: 'Visibility', weeks: 2 },
    { name: 'E-Commerce', weeks: 3 },
  ],
  steps: [
    {
      marker: 'First message',
      title: 'You tell us what you need.',
      body: 'You get back a price, a date, and the first name of the developer who would build it. No discovery call required to find out what it costs.',
    },
    {
      marker: 'Day one',
      title: 'Everything is registered in your name.',
      body: 'Half up front, and the domain, the hosting and the Google Business Profile are created under your details that same day. You hold the accounts while we are still building.',
    },
    {
      marker: 'Build',
      title: 'You watch it happen.',
      body: 'One week, two or three depending on the package. You get a link you can open and share at any point, not a reveal at the end.',
    },
    {
      marker: 'Handover',
      title: 'The rest on sign-off.',
      body: 'Second half when it is live and you are happy. Every credential is already yours, so handover is a conversation, not a migration.',
    },
  ],
}

export type Tier = 'launch' | 'visibility' | 'ecommerce'

export const TIERS: {
  key: Tier
  code: string
  name: string
  price: string
  timeline: string
  guarantees: number
  promise: string
  popular?: boolean
  /** Struck through on the price sheet. Omit to end the promotion. */
  priceBefore?: string
  saving?: string
}[] = [
  { key: 'launch', code: '01', name: 'Launch', price: '400,000', priceBefore: '500,000', saving: '100,000', timeline: '1 week', guarantees: 8, promise: 'Get online. Look like a real business.' },
  { key: 'visibility', code: '02', name: 'Visibility', price: '600,000', priceBefore: '750,000', saving: '150,000', timeline: '2 weeks', guarantees: 8, promise: 'Be the one Google sends customers to.', popular: true },
  { key: 'ecommerce', code: '03', name: 'E-Commerce', price: '1,300,000', priceBefore: '1,500,000', saving: '200,000', timeline: '3 weeks', guarantees: 9, promise: 'Sell online. Real payments. Real growth.' },
]


/**
 * Rows are derived from the packages' own wording — E-Commerce states "Everything in
 * Visibility — fast website, full SEO, Google Business Profile, reviews pipeline and
 * admin", which is what places those four rows in Visibility. Verify before launch.
 */
export const MATRIX: { group: string; rows: { label: string; in: Tier[] }[] }[] = [
  {
    group: 'Foundation',
    rows: [
      { label: 'Domain and DNS, registered in your name', in: ['launch', 'visibility', 'ecommerce'] },
      { label: 'Hosting with SSL — HTTPS from day one', in: ['launch', 'visibility', 'ecommerce'] },
      { label: 'Multi-page website — home, services, about, contact, blog', in: ['launch', 'visibility', 'ecommerce'] },
      { label: 'Mobile-first, under 2 seconds on Rwandan mobile', in: ['launch', 'visibility', 'ecommerce'] },
    ],
  },
  {
    group: 'Getting found',
    rows: [
      { label: 'Full SEO', in: ['visibility', 'ecommerce'] },
      { label: 'Google Business Profile, verified in your name', in: ['visibility', 'ecommerce'] },
      { label: 'Reviews pipeline', in: ['visibility', 'ecommerce'] },
      { label: 'Admin dashboard your team runs without a developer', in: ['visibility', 'ecommerce'] },
    ],
  },
  {
    group: 'Selling',
    rows: [
      { label: 'Storefront — browse, search, filter, cart, checkout', in: ['ecommerce'] },
      { label: 'MoMo accepted at checkout', in: ['ecommerce'] },
      { label: 'Catalogue with categories, photos and variants', in: ['ecommerce'] },
      { label: 'Live stock counts, discount codes, promotions', in: ['ecommerce'] },
    ],
  },
]

export const BESPOKE: {
  code: string
  name: string
  promise: string
  /** Omit entirely when the work is only ever quoted after a conversation. */
  price?: string
  note?: string
}[] = [
  { code: '04', name: 'Custom Software', price: '1,600,000', promise: 'Your idea, built exactly the way you work.' },
  { code: '05', name: 'Mobile App', price: '1,700,000', promise: 'One app for Android and iOS.' },
  {
    code: '06',
    name: 'AI assistant',
    promise:
      'An FAQ bot on your website that answers customers in your voice — or a private one behind your login, so staff stop hunting through files for the same answer.',
    note: 'Priced once we see your material',
  },
]

/** What the studio actually makes — real capability, no invented case studies. */
export const CAPABILITIES = [
  {
    name: 'Websites',
    body: 'Multi-page sites that load in under two seconds on a Rwandan phone, on a domain and host registered to you.',
    meta: 'From 400,000 RWF',
  },
  {
    name: 'Google presence',
    body: 'A Business Profile verified in your name, set up properly, plus the review flow that keeps it climbing in local results.',
    meta: 'From 600,000 RWF',
  },
  {
    name: 'Online stores',
    body: 'A storefront built for how Rwandans actually shop, with MoMo at checkout, live stock, variants and discount codes.',
    meta: 'From 1,300,000 RWF',
  },
  {
    name: 'Admin dashboards',
    body: 'The back office your staff run themselves — orders, stock, content and hours — without calling a developer to change a price.',
    meta: 'Included from Visibility',
  },
  {
    name: 'Mobile apps',
    body: 'One build that ships to both Android and iOS, scoped and quoted against how your business actually works.',
    meta: 'From 1,700,000 RWF',
  },
  {
    name: 'AI assistants',
    body: 'Retrieval-trained on your own documents and catalogue. Put it on your site to answer customers, or keep it internal so your team can ask instead of searching.',
    meta: 'Quoted per project',
  },
]

export const FAQ = [
  { q: 'How long does a build actually take?', a: 'Launch is one week, Visibility two, E-Commerce three. Those dates go into the agreement, so they are commitments rather than estimates. Custom software and mobile apps are scoped individually — you still get a named date before you pay anything.' },
  { q: 'Do I really own everything afterwards?', a: 'Yes, and you own it from the first day rather than the last. The domain, the hosting, the Google Business Profile and every login are created in your name at the start. There is no lock-in: if you leave, you take all of it and nothing stops working.' },
  { q: 'Can I pay in parts?', a: 'Half to start, half when it is live and you have signed off. Nothing is held hostage in between — the accounts are already yours.' },
  { q: 'What if I need a change after we launch?', a: 'Small changes you make yourself from the dashboard — that is what it is there for. Anything bigger, message us and you get a price and a date for it, same as any other build. There is nothing to sign up to and nothing running in the background.' },
  { q: 'Do you work outside Kigali?', a: 'Yes, anywhere in Rwanda. Most of the process runs over WhatsApp and calls, so where you are does not change the price or the date.' },
  { q: 'Is my business too small for this?', a: 'Launch exists for exactly that — one week and 400,000 RWF for a real domain and a proper site. If people are already searching for what you sell, being findable matters more than being big.' },
  { q: 'How do I take MoMo payments on my site?', a: 'It is built into the E-Commerce package. Checkout accepts Mobile Money the way your customers already pay, and orders and payment status show up in your dashboard. You do not need a developer to run it.' },
  { q: 'How do I rank on Google Maps in Kigali?', a: 'A verified and complete Business Profile, the same details everywhere you appear online, a fast site Google can read, and a steady flow of genuine reviews. That is what the Visibility package is built to do.' },
  { q: 'What is a RAG assistant, in plain terms?', a: 'A chat assistant that reads your own material — price lists, policies, catalogue, past answers — before it replies, so it quotes your business instead of inventing something. Put it on your website as an FAQ bot that answers customers at two in the morning, or keep it behind your login so staff can ask it instead of digging through files. Either way it is quoted per project, once we have seen what it needs to read.' },
  { q: 'Why publish your prices when nobody else does?', a: 'Because a hidden price is a negotiation you are set up to lose. Ours are on this page. If a project genuinely falls outside them, we say so and quote it before you commit.' },
]

export const FOOTER = {
  columns: [
    { title: 'Build', links: ['Websites', 'Google presence', 'Online stores', 'Admin dashboards', 'Mobile apps', 'AI assistants'] },
    { title: 'Packages', links: ['Launch — 400,000', 'Visibility — 600,000', 'E-Commerce — 1,300,000', 'Custom software', 'Mobile app', 'AI assistant'] },
    { title: 'Studio', links: ['How it goes', 'Questions', 'Contact'] },
    { title: 'Elsewhere', links: ['Instagram', 'LinkedIn', 'GitHub', 'Privacy & terms'] },
  ],
  micro: ['Built in Kigali', 'Yours from day one — no lock-in'],
}
