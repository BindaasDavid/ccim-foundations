const spokenTerms: [RegExp, string][] = [
  [/\bNOI\b/g, "net operating income"],
  [/\bPRI\b/g, "potential rental income"],
  [/\bGOI\b/g, "gross operating income"],
  [/\bERI\b/g, "effective rental income"],
  [/\bCFBT\b/g, "cash flow before tax"],
  [/\bCFAT\b/g, "cash flow after tax"],
  [/\bIRR\b/g, "I R R"],
  [/\bNPV\b/g, "N P V"],
  [/\bTVM\b/g, "time value of money"],
  [/\bLTV\b/g, "loan to value"],
  [/\bADS\b/g, "annual debt service"],
  [/\bCAM\b/g, "common area maintenance"],
  [/\bAPOD\b/g, "A pod"],
  [/\bCFAW\b/g, "cash flow worksheet"],
  [/\bACSW\b/g, "sale worksheet"],
  [/\bDCF\b/g, "D C F"],
  [/\bI\/YR\b/gi, "interest per year"],
  [/\bpsf\b/gi, "per square foot"],
  [/\$\/SF\b/gi, "dollars per square foot"],
  [/\bSF\b/g, "square feet"],
  [/\be\.g\./gi, "for example"],
  [/\bi\.e\./gi, "that is"],
]

export function forSpeech(raw: string): string {
  let t = raw
    .replace(/[•●▪]/g, ". ")
    .replace(/\.{4,}|_{4,}|…+/g, ". ")
    .replace(/\s*[—–]\s*/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/(\d)\s+%/g, "$1 percent")
    .trim()
  for (const [re, spoken] of spokenTerms) t = t.replace(re, spoken)
  if (t && !/[.!?]$/.test(t)) t += "."
  return t
}

export function splitForCadence(raw: string): string[] {
  const text = forSpeech(raw)
  const protectedText = text
    .replace(/\b(Mr|Ms|Mrs|Dr|St|No|vs|Fig|pp)\./g, "$1∯")
    .replace(/\b([A-Z])\./g, "$1∯")
  const parts = protectedText
    .split(/(?<=[.!?])\s+|(?<=;)\s+|(?<=:)\s+(?=[A-Z“"])/)
    .flatMap((chunk) => splitToBreath(chunk))
    .map((s) => s.replace(/∯/g, ".").trim())
    .filter((s) => s.length > 1)

  return parts.length ? parts : [text]
}

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}

function splitToBreath(chunk: string): string[] {
  const s = chunk.trim()
  if (!s) return []
  if (wordCount(s) <= 16) return [s]

  const clause = s.split(/,\s+(?=(?:and|but|or|so|yet|which|that|because|then|when|if|while|although)\b)/i)
  if (clause.length > 1) {
    return clause.flatMap((bit, i) => {
      const piece = i < clause.length - 1 && !/[.!?,;:]$/.test(bit.trim()) ? `${bit.trim()},` : bit.trim()
      return splitToBreath(piece)
    })
  }

  if (wordCount(s) <= 22) return [s]

  const commas = s.split(/,\s+/)
  if (commas.length > 1) {
    const out: string[] = []
    let buf = ""
    for (let i = 0; i < commas.length; i++) {
      const next = buf ? `${buf}, ${commas[i]}` : commas[i]
      if (wordCount(next) > 16 && buf) {
        out.push(/[,.!?]$/.test(buf) ? buf : `${buf},`)
        buf = commas[i]
      } else {
        buf = next
      }
    }
    if (buf) out.push(buf)
    return out.flatMap((p) => (wordCount(p) > 22 ? splitToBreath(p) : [p]))
  }

  return [s]
}

export function pauseAfter(text: string): number {
  const s = text.trim()
  if (/\?$/.test(s)) return 560
  if (/!$/.test(s)) return 420
  if (/\.$/.test(s)) return 440
  if (/;$/.test(s)) return 300
  if (/:$/.test(s)) return 280
  if (/,$/.test(s)) return 180
  return 260
}

const novelty = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|hound|junior|kathy|pipe|princess|ralph|trinoids|whisper|zarvox|organ|jester|superstar/i
const notEnglish = /chinese|mandarin|cantonese|putonghua|cmn-|yue-|zh-|中文|普通话|粤语|ting-ting|sinji|meijia|li-mu|yaoyao/i

export function isEnglishVoice(v: SpeechSynthesisVoice): boolean {
  const lang = (v.lang || "").toLowerCase()
  const name = `${v.name} ${v.voiceURI}`
  if (notEnglish.test(name) || notEnglish.test(lang)) return false
  if (novelty.test(v.name)) return false
  if (!lang.startsWith("en")) return false
  if (/\b(flo|reed|eddy|nora|gordon|zoe|ava)\b/i.test(name) && notEnglish.test(name)) return false
  return true
}

const femaleName = /\b(flo|samantha|ava|zoe|nicky|allison|susan|karen|moira|serena|kate|martha|sandy|shelley|nora)\b/i

export function pickEnglishVoice(voices: SpeechSynthesisVoice[], preferredURI = ""): SpeechSynthesisVoice | undefined {
  const english = rankVoices(voices)
  const preferred = english.find((v) => v.voiceURI === preferredURI)
  if (preferred && !femaleName.test(`${preferred.name} ${preferred.voiceURI}`)) return preferred
  return english[0]
}

export function rankVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const scored = voices
    .filter(isEnglishVoice)
    .map((v) => ({ v, score: voiceScore(v) }))
    .sort((a, b) => b.score - a.score)
  return scored.map((x) => x.v)
}

function voiceScore(v: SpeechSynthesisVoice): number {
  const n = `${v.name} ${v.voiceURI}`
  let s = 0
  if (/premium|enhanced|neural|personal|siri/i.test(n)) s += 90
  if (/\breed\b/i.test(n) && /en-us|english \(united states\)/i.test(n)) s += 140
  if (/\beddy\b/i.test(n) && /en-us|english \(united states\)/i.test(n)) s += 110
  if (/\b(aaron|evan|nathan|tom)\b/i.test(n)) s += 85
  if (/\b(daniel|oliver)\b/i.test(n)) s += 55
  if (/\b(gordon|santa|fred|ralph)\b/i.test(n)) s -= 30
  if (/\b(flo|samantha|ava|zoe|nicky|allison|susan|karen|moira|serena|kate|martha|sandy|shelley|nora)\b/i.test(n)) s -= 80
  if (/en-us/i.test(v.lang)) s += 12
  if (v.localService) s += 8
  if (/compact/i.test(n)) s -= 40
  return s
}

export const CONVERSATIONAL_RATE = 0.88
export const SENTENCE_GAP_MS = 440
export const PASSAGE_GAP_MS = 820
