import type { KokoroTTS } from "kokoro-js"

export const HUMAN_VOICES = [
  { id: "am_liam", label: "Liam — tenor" },
  { id: "am_echo", label: "Echo — bright" },
  { id: "am_puck", label: "Puck — light" },
  { id: "am_eric", label: "Eric — clear" },
  { id: "am_michael", label: "Michael — even" },
] as const

export type HumanVoiceId = (typeof HUMAN_VOICES)[number]["id"]

export function isHumanReady() {
  return model !== null
}

type Raw = { audio?: Float32Array; sampling_rate?: number; toBlob?: () => Blob }

let model: KokoroTTS | null = null
let loading: Promise<KokoroTTS> | null = null

export async function loadHumanVoice(onStatus?: (msg: string) => void): Promise<KokoroTTS> {
  if (model) return model
  if (loading) return loading
  onStatus?.("Downloading a human voice (once)…")
  loading = (async () => {
    const opts = { dtype: "q8" as const, progress_callback: (p: { status?: string; file?: string }) => {
      if (p.status === "progress" || p.status === "download") onStatus?.("Downloading voice model…")
      if (p.status === "done") onStatus?.("Preparing voice…")
    } }
    const { KokoroTTS } = await import("kokoro-js")
    try {
      model = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { ...opts, device: "webgpu" })
    } catch {
      model = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { ...opts, device: "wasm" })
    }
    onStatus?.("Voice ready")
    return model
  })()
  try {
    return await loading
  } catch (err) {
    loading = null
    throw err
  }
}

export async function speakHuman(text: string, voice: HumanVoiceId, speed: number): Promise<HTMLAudioElement> {
  const tts = await loadHumanVoice()
  const id = voice.startsWith("am_") ? voice : "am_liam"
  const pace = Math.min(1.15, Math.max(0.8, speed))
  const raw = (await tts.generate(text, { voice: id, speed: pace })) as Raw
  const url = raw.toBlob ? URL.createObjectURL(raw.toBlob()) : floatToWavUrl(raw.audio ?? new Float32Array(), raw.sampling_rate ?? 24000)
  const el = new Audio(url)
  el.onended = () => URL.revokeObjectURL(url)
  return el
}

function floatToWavUrl(samples: Float32Array, sampleRate: number): string {
  const bytes = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(bytes)
  const write = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i))
  }
  write(0, "RIFF")
  view.setUint32(4, 36 + samples.length * 2, true)
  write(8, "WAVE")
  write(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, "data")
  view.setUint32(40, samples.length * 2, true)
  let o = 44
  for (let i = 0; i < samples.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }))
}
