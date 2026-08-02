/**
 * Generates the assistant's knowledge base from src/content.ts.
 *
 * content.ts is the single source the site renders prices from, so deriving the KB
 * here is what stops Munyakazi quoting a price the page no longer shows. Output goes
 * to public/kb.txt, which ships with the site and is therefore served at /kb.txt for
 * the bot service to fetch.
 *
 * Two properties matter and are deliberate:
 *   - Plain text, not JSON. This string is pasted straight into a system prompt; JSON
 *     would spend tokens on syntax the model has to parse past.
 *   - Byte-stable. Sections and fields are emitted in fixed order with no timestamp,
 *     so an unchanged content.ts produces an identical file. DeepSeek's prompt cache
 *     matches on an exact token prefix — any churn here silently costs 50x on input.
 *
 * Run: npm run build:kb   (also runs as part of npm run build)
 */
import { build } from 'esbuild'
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = join(ROOT, 'public', 'kb.txt')

async function loadContent() {
  // content.ts is pure data with no imports, so bundling it to ESM and importing is
  // simpler and less brittle than parsing TypeScript.
  const dir = await mkdtemp(join(tmpdir(), 'briqx-kb-'))
  const outfile = join(dir, 'content.mjs')
  await build({
    entryPoints: [join(ROOT, 'src', 'content.ts')],
    outfile,
    format: 'esm',
    bundle: true,
    platform: 'node',
    logLevel: 'silent',
  })
  const mod = await import(pathToFileURL(outfile).href)
  await rm(dir, { recursive: true, force: true })
  return mod
}

const line = (s) => s.replace(/\s+/g, ' ').trim()

function render(c) {
  const out = []
  const push = (s = '') => out.push(s)

  push(`# ${c.BRAND.name} — knowledge base`)
  push()
  push(
    `${c.BRAND.name} is a software studio in ${c.BRAND.place}. ${line(c.HERO.subtext)}`,
  )
  push()

  push('## What we charge')
  push()
  for (const t of c.TIERS) {
    const bits = [`${t.name} (package ${t.code}) — ${t.price} RWF, live in ${t.timeline}.`]
    if (t.priceBefore) {
      bits.push(
        `Currently discounted from ${t.priceBefore} RWF, a saving of ${t.saving} RWF.`,
      )
    }
    bits.push(line(t.promise))
    bits.push(`Includes ${t.guarantees} written guarantees.`)
    if (t.popular) bits.push('This is the most commonly chosen package.')
    push(`- ${bits.join(' ')}`)
  }
  for (const b of c.BESPOKE) {
    const price = b.price ? `from ${b.price} RWF` : line(b.note ?? 'quoted per project')
    push(`- ${b.name} (package ${b.code}) — ${price}. ${line(b.promise)}`)
  }
  push()
  push('Prices are in Rwandan francs (RWF). Payment is 50% to begin and 50% on sign-off.')
  push()

  push('## What each package includes')
  push()
  push('Each package contains everything in the one below it.')
  for (const group of c.MATRIX) {
    push()
    push(`${group.group}:`)
    for (const row of group.rows) {
      const names = row.in
        .map((k) => c.TIERS.find((t) => t.key === k)?.name)
        .filter(Boolean)
        .join(', ')
      push(`- ${line(row.label)} — included in: ${names}.`)
    }
  }
  push()

  push('## What we build')
  push()
  for (const cap of c.CAPABILITIES) {
    push(`- ${cap.name} (${line(cap.meta)}): ${line(cap.body)}`)
  }
  push()

  push('## How a build runs')
  push()
  push(line(c.SCHEDULE.note))
  for (const w of c.SCHEDULE.windows) {
    push(`- ${w.name}: ${w.weeks} week${w.weeks === 1 ? '' : 's'} to live.`)
  }
  push()
  for (const s of c.SCHEDULE.steps) {
    push(`- ${s.marker} — ${line(s.title)} ${line(s.body)}`)
  }
  push()

  push('## Where we stand')
  push()
  for (const claim of c.MANIFESTO.claims) {
    push(`- ${claim.key}: ${line(claim.body)}`)
  }
  push()
  for (const term of c.HERO.terms) {
    push(`- ${term.label}: ${term.value}${term.unit ? ' ' + term.unit : ''} (${line(term.note)}).`)
  }
  push()

  push('## Questions we are asked')
  push()
  for (const item of c.FAQ) {
    push(`Q: ${line(item.q)}`)
    push(`A: ${line(item.a)}`)
    push()
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

const content = await loadContent()
const kb = render(content)
await mkdir(join(ROOT, 'public'), { recursive: true })
await writeFile(OUT, kb, 'utf8')

const words = kb.split(/\s+/).filter(Boolean).length
console.log(
  `kb.txt written — ${kb.length} chars, ~${Math.round(kb.length / 4)} tokens, ${words} words`,
)
