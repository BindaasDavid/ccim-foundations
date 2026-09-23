export function pmt(rate: number, nper: number, pv: number, fv = 0, type = 0): number {
  if (nper === 0) return 0
  if (rate === 0) return -(pv + fv) / nper
  const pvif = (1 + rate) ** nper
  let payment = (rate * (pv * pvif + fv)) / ((1 + rate * type) * (pvif - 1))
  return -payment
}

export function fv(rate: number, nper: number, payment: number, pv = 0, type = 0): number {
  if (nper === 0) return -pv
  if (rate === 0) return -(pv + payment * nper)
  const pvif = (1 + rate) ** nper
  return -(pv * pvif + payment * (1 + rate * type) * (pvif - 1) / rate)
}

export function pv(rate: number, nper: number, payment: number, future = 0, type = 0): number {
  if (nper === 0) return -future
  if (rate === 0) return -(future + payment * nper)
  const pvif = (1 + rate) ** nper
  return -(future + payment * (1 + rate * type) * (pvif - 1) / rate) / pvif
}

export function nper(rate: number, payment: number, present: number, future = 0, type = 0): number {
  if (rate === 0) return -(present + future) / payment
  const pmtAdj = payment * (1 + rate * type)
  return Math.log((pmtAdj - future * rate) / (pmtAdj + present * rate)) / Math.log(1 + rate)
}

export function rate(nperVal: number, payment: number, present: number, future = 0, type = 0, guess = 0.1): number {
  let r = guess
  for (let i = 0; i < 80; i++) {
    const f = fv(r, nperVal, payment, present, type) - future
    const dr = r === 0 ? 1e-6 : r * 1.0001
    const f2 = fv(dr, nperVal, payment, present, type) - future
    const df = (f2 - f) / (dr - r)
    if (Math.abs(df) < 1e-14) break
    const next = r - f / df
    if (!Number.isFinite(next)) break
    if (Math.abs(next - r) < 1e-10) return next
    r = next
  }
  return r
}

export function npv(discountRate: number, cashFlows: number[]): number {
  return cashFlows.reduce((sum, cf, t) => sum + cf / (1 + discountRate) ** t, 0)
}

export function irr(cashFlows: number[], guess = 0.1): number | null {
  if (cashFlows.length < 2) return null
  let r = guess
  for (let i = 0; i < 100; i++) {
    let f = 0
    let df = 0
    cashFlows.forEach((cf, t) => {
      const denom = (1 + r) ** t
      f += cf / denom
      if (t > 0) df -= (t * cf) / (1 + r) ** (t + 1)
    })
    if (Math.abs(df) < 1e-14) break
    const next = r - f / df
    if (!Number.isFinite(next) || next <= -0.999) {
      r = r / 2
      continue
    }
    if (Math.abs(next - r) < 1e-10) return Math.abs(f) < 1e-4 ? next : null
    r = next
  }
  return Math.abs(npv(r, cashFlows)) < 1e-4 ? r : null
}

export type AmortRow = {
  period: number
  year: number
  beginning: number
  interest: number
  principal: number
  ending: number
}

export function amortize(loan: number, annualRate: number, years: number, ppy: number): {
  payment: number
  rows: AmortRow[]
} {
  const n = Math.round(years * ppy)
  const i = annualRate / ppy
  const payment = -pmt(i, n, loan, 0, 0)
  const rows: AmortRow[] = []
  let bal = loan
  for (let p = 1; p <= n; p++) {
    const interest = bal * i
    let principal = payment - interest
    if (p === n) principal = bal
    const ending = Math.max(0, bal - principal)
    rows.push({
      period: p,
      year: Math.ceil(p / ppy),
      beginning: bal,
      interest,
      principal,
      ending,
    })
    bal = ending
  }
  return { payment, rows }
}

export function remainingBalance(loan: number, annualRate: number, amortYears: number, ppy: number, periodsElapsed: number): number {
  const n = amortYears * ppy
  const i = annualRate / ppy
  const payment = pmt(i, n, -loan, 0, 0)
  return -pv(i, n - periodsElapsed, payment, 0, 0)
}

export function mean(values: number[]): number {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function median(values: number[]): number {
  if (!values.length) return 0
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export function stdev(values: number[]): number {
  if (values.length < 2) return 0
  const m = mean(values)
  const v = values.reduce((acc, x) => acc + (x - m) ** 2, 0) / (values.length - 1)
  return Math.sqrt(v)
}
