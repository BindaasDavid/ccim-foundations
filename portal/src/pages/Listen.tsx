import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { modules } from "../data/modules"
import { flatten, loadReading, type ReadingDoc } from "../lib/readings"
import { HUMAN_VOICES, isHumanReady, loadHumanVoice, speakHuman, type HumanVoiceId } from "../lib/humanTts"
import { CONVERSATIONAL_RATE, PASSAGE_GAP_MS, forSpeech, pauseAfter, pickEnglishVoice, rankVoices, splitForCadence } from "../lib/speech"
import { Page } from "../components/ui"

function minutes(words: number) {
  return Math.max(1, Math.round(words / 140))
}

export function ListenIndex() {
  return (
    <Page kicker="Read aloud" title="Listen to modules 1–10" source="Spoken from the official module packets on this computer">
      <p className="mb-6 max-w-2xl text-sm text-ink/65">
        Human voice is the neural reader (Liam — English male tenor). The first play downloads a
        model once and keeps it on this computer. That is what sounds like a person. Reed is only the
        Mac backup.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {modules.map((m) => (
          <Link key={m.id} to={`/listen/${m.id}`} className="rounded-xl border border-line bg-paper p-5 hover:border-gold">
            <p className="text-xs text-gold-deep">Module {m.number}</p>
            <h3 className="font-serif mt-1 text-xl">{m.title}</h3>
            <p className="mt-2 text-sm text-ink/55">{m.pages} pages · {m.packet}</p>
          </Link>
        ))}
      </div>
    </Page>
  )
}

export function ListenPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const meta = modules.find((m) => m.id === id)
  const [doc, setDoc] = useState<ReadingDoc | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skipAnswers, setSkipAnswers] = useState(true)
  const [natural, setNatural] = useState(true)
  const [engine, setEngine] = useState<"human" | "mac">("mac")
  const [humanVoice, setHumanVoice] = useState<HumanVoiceId>("am_liam")
  const [loadNote, setLoadNote] = useState("")
  const [rate, setRate] = useState(CONVERSATIONAL_RATE)
  const [voiceURI, setVoiceURI] = useState("")
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [index, setIndex] = useState(0)
  const [sentence, setSentence] = useState(0)
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle")
  const indexRef = useRef(0)
  const sentenceRef = useRef(0)
  const statusRef = useRef(status)
  const naturalRef = useRef(natural)
  const rateRef = useRef(rate)
  const voiceURIRef = useRef(voiceURI)
  const voicesRef = useRef(voices)
  const engineRef = useRef(engine)
  const humanVoiceRef = useRef(humanVoice)
  const blocksRef = useRef<{ page: number; text: string }[]>([])
  const timerRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeRef = useRef<HTMLDivElement | null>(null)

  const blocks = useMemo(() => (doc ? flatten(doc, skipAnswers) : []), [doc, skipAnswers])
  blocksRef.current = blocks
  statusRef.current = status
  indexRef.current = index
  sentenceRef.current = sentence
  naturalRef.current = natural
  rateRef.current = rate
  voiceURIRef.current = voiceURI
  voicesRef.current = voices
  engineRef.current = engine
  humanVoiceRef.current = humanVoice

  const words = useMemo(() => blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0), [blocks])
  const sentences = useMemo(
    () => (blocks[index] ? (natural ? splitForCadence(blocks[index].text) : [forSpeech(blocks[index].text)]) : []),
    [blocks, index, natural],
  )

  useEffect(() => {
    setIndex((i) => (blocks.length ? Math.min(i, blocks.length - 1) : 0))
  }, [blocks.length])

  useEffect(() => {
    if (!id) return
    loadReading(id)
      .then((d) => {
        setDoc(d)
        setIndex(0)
        setSentence(0)
        setStatus("idle")
      })
      .catch((e: Error) => setError(e.message))
  }, [id])

  useEffect(() => {
    const loadVoices = () => {
      const ordered = rankVoices(window.speechSynthesis.getVoices())
      setVoices(ordered)
      setVoiceURI((cur) => pickEnglishVoice(ordered, cur)?.voiceURI ?? "")
    }
    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      window.speechSynthesis.cancel()
      audioRef.current?.pause()
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [index])

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function later(ms: number, fn: () => void) {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      if (statusRef.current === "playing") fn()
    }, ms)
  }

  function pieces(text: string) {
    return naturalRef.current ? splitForCadence(text) : [forSpeech(text)]
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.onended = null
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
  }

  function advance(start: number, line: number, total: number, spoken: string) {
    if (statusRef.current !== "playing") return
    if (line + 1 < total) {
      later(pauseAfter(spoken), () => void speakAt(start, line + 1))
      return
    }
    const next = start + 1
    if (next < blocksRef.current.length) later(PASSAGE_GAP_MS, () => void speakAt(next, 0))
    else setStatus("idle")
  }

  async function speakAt(start: number, startSentence = 0) {
    window.speechSynthesis.cancel()
    stopAudio()
    clearTimer()
    const queue = blocksRef.current
    if (!queue[start]) {
      setStatus("idle")
      return
    }
    const lines = pieces(queue[start].text)
    const line = Math.min(startSentence, Math.max(0, lines.length - 1))
    setIndex(start)
    setSentence(line)
    setStatus("playing")

    if (engineRef.current === "human" && isHumanReady()) {
      try {
        setLoadNote("Reading with Liam…")
        const spoken = lines[line]
        const el = await Promise.race([
          speakHuman(spoken, humanVoiceRef.current, rateRef.current),
          new Promise<HTMLAudioElement>((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 12000)),
        ])
        if (statusRef.current !== "playing" || indexRef.current !== start || sentenceRef.current !== line) {
          el.pause()
          return
        }
        setLoadNote("")
        audioRef.current = el
        el.onended = () => advance(start, line, lines.length, spoken)
        await el.play()
        return
      } catch (err) {
        setLoadNote(`Human voice not ready (${err instanceof Error ? err.message : "error"}). Using Reed.`)
      }
    } else if (engineRef.current === "human") {
      setLoadNote("Human voice is still loading. Reed is reading until it is ready.")
      void loadHumanVoice(setLoadNote).catch(() => undefined)
    }
    speakEnglish(start, line, lines)
  }

  function speakEnglish(start: number, line: number, lines: string[]) {
    const voice =
      pickEnglishVoice(voicesRef.current, voiceURIRef.current) ??
      voicesRef.current.find((v) => v.lang.toLowerCase().startsWith("en"))
    const spoken = lines[line]
    const utter = new SpeechSynthesisUtterance(spoken)
    utter.lang = "en-US"
    utter.rate = /\?$/.test(spoken.trim()) ? Math.min(1.05, rateRef.current + 0.03) : rateRef.current
    utter.pitch = /\?$/.test(spoken.trim()) ? 1.18 : 1.12
    if (voice) utter.voice = voice
    utter.onend = () => advance(start, line, lines.length, spoken)
    utter.onerror = () => {
      if (statusRef.current === "playing") setStatus("idle")
    }
    window.speechSynthesis.speak(utter)
  }

  function play() {
    if (status === "paused") {
      if (audioRef.current) void audioRef.current.play()
      else window.speechSynthesis.resume()
      setStatus("playing")
      return
    }
    if (engine === "human" && !isHumanReady()) {
      setLoadNote("Loading the human voice in the background. Reed is reading now.")
      void loadHumanVoice(setLoadNote).catch(() => setLoadNote("Human voice failed to load. Staying on Reed."))
    }
    void speakAt(index, sentence)
  }

  function pause() {
    audioRef.current?.pause()
    window.speechSynthesis.pause()
    clearTimer()
    setStatus("paused")
  }

  function stop() {
    window.speechSynthesis.cancel()
    stopAudio()
    clearTimer()
    setStatus("idle")
    setSentence(0)
  }

  function jump(next: number) {
    const clamped = Math.max(0, Math.min(blocks.length - 1, next))
    setSentence(0)
    if (status === "playing") void speakAt(clamped, 0)
    else {
      window.speechSynthesis.cancel()
      stopAudio()
      clearTimer()
      setIndex(clamped)
    }
  }

  if (!meta) return <Page kicker="Listen" title="Module not found">Unknown module.</Page>
  if (error) return <Page kicker="Listen" title={meta.title}>{error}</Page>
  if (!doc) return <Page kicker="Listen" title={meta.title}>Loading packet…</Page>

  const current = blocks[index]

  return (
    <Page kicker={`Module ${meta.number} · read aloud`} title={meta.title} source={meta.packet}>
      <div className="sticky top-0 z-10 mb-6 rounded-xl border border-line bg-paper/95 p-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {status !== "playing" ? (
            <button className="rounded-md bg-ink px-4 py-2 text-sm text-cream" onClick={() => void play()}>
              {status === "paused" ? "Resume" : "Read aloud"}
            </button>
          ) : (
            <button className="rounded-md bg-ink px-4 py-2 text-sm text-cream" onClick={pause}>
              Pause
            </button>
          )}
          <button className="rounded-md border border-line px-3 py-2 text-sm" onClick={stop}>
            Stop
          </button>
          <button className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => jump(index - 1)}>
            Previous
          </button>
          <button className="rounded-md border border-line px-3 py-2 text-sm" onClick={() => jump(index + 1)}>
            Next
          </button>
          <Link to="/listen" className="ml-auto text-sm text-gold-deep">
            All modules
          </Link>
        </div>
        <p className="mt-3 text-sm font-medium text-ink">Language: English (United States) · male tenor</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-ink/60">
            Voice engine
            <select
              className="mt-1 w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
              value={engine}
              onChange={(e) => setEngine(e.target.value as "human" | "mac")}
            >
              <option value="human">Human (neural)</option>
              <option value="mac">Mac backup (Reed)</option>
            </select>
          </label>
          {engine === "human" ? (
            <label className="text-xs text-ink/60">
              Human voice
              <select
                className="mt-1 w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
                value={humanVoice}
                onChange={(e) => setHumanVoice(e.target.value as HumanVoiceId)}
              >
                {HUMAN_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="text-xs text-ink/60">
              Mac voice
              <select
                className="mt-1 w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
                value={voiceURI}
                onChange={(e) => setVoiceURI(e.target.value)}
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} · {v.lang}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-xs text-ink/60">
            Speed
            <input
              type="range"
              min={0.75}
              max={1.2}
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full"
            />
            <span className="text-ink">{rate.toFixed(2)}×</span>
          </label>
          <div className="flex flex-col justify-end gap-2 pb-1 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={natural} onChange={(e) => setNatural(e.target.checked)} />
              Natural pauses
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={skipAnswers} onChange={(e) => setSkipAnswers(e.target.checked)} />
              Skip answer keys
            </label>
          </div>
        </div>
        <p className="mt-2 text-xs text-ink/50">
          {loadNote ? `${loadNote} · ` : ""}
          Passage {blocks.length ? index + 1 : 0} of {blocks.length}
          {current ? ` · packet page ${current.page}` : ""}
          {sentences.length ? ` · sentence ${Math.min(sentence + 1, sentences.length)} of ${sentences.length}` : ""}
          · about {minutes(words)} min
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              stop()
              navigate(`/listen/${m.id}`)
            }}
            className={`rounded-full px-3 py-1 text-xs ${m.id === id ? "bg-ink text-cream" : "border border-line bg-paper"}`}
          >
            {m.number}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div
            key={`${b.page}-${i}`}
            ref={i === index ? activeRef : undefined}
            onClick={() => jump(i)}
            className={`cursor-pointer rounded-xl border px-5 py-4 text-[17px] leading-relaxed ${
              i === index ? "border-gold bg-gold/15" : "border-transparent text-ink/80 hover:bg-paper"
            }`}
          >
            <p className="mb-1 text-[11px] tracking-wide text-ink/40 uppercase">Page {b.page}</p>
            {i === index && natural
              ? sentences.map((s, si) => (
                  <span key={si} className={si === sentence ? "rounded bg-gold/30" : undefined}>
                    {s}{" "}
                  </span>
                ))
              : b.text}
          </div>
        ))}
      </div>
    </Page>
  )
}
