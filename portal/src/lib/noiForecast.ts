export const NOI_YEARS = [1, 2, 3, 4, 5, 6] as const

export type TenantRow = {
  name: string
  sf: number
  rents: number[]
}

export type NoiDrivers = {
  vacPct: number
  mgmtPct: number
  adminPct: number
  stopPsf: number
  buildingSf: number
}

export const exampleTenants: TenantRow[] = [
  { name: "Suite 100", sf: 3000, rents: [54000, 54000, 56700, 56700, 59535, 59535] },
  { name: "Suite 200", sf: 4000, rents: [72000, 72000, 72000, 75600, 75600, 79380] },
  { name: "Suite 300", sf: 2500, rents: [40000, 40000, 42000, 42000, 42000, 44100] },
  { name: "Suite 400", sf: 2500, rents: [37500, 37500, 37500, 39375, 39375, 39375] },
]

export const exampleDrivers: NoiDrivers = {
  vacPct: 5,
  mgmtPct: 4,
  adminPct: 1,
  stopPsf: 2.25,
  buildingSf: 12000,
}

export type NoiYear = {
  pri: number
  vacancy: number
  goi: number
  mgmt: number
  admin: number
  other: number
  opex: number
  noi: number
}

export function dollars(n: number) {
  return Math.round(n)
}

export function buildNoiForecast(tenants: TenantRow[], d: NoiDrivers): NoiYear[] {
  const other = d.stopPsf * d.buildingSf
  return NOI_YEARS.map((_, i) => {
    const pri = dollars(tenants.reduce((s, t) => s + (t.rents[i] ?? 0), 0))
    const vacancy = dollars(pri * (d.vacPct / 100))
    const goi = pri - vacancy
    const mgmt = dollars(goi * (d.mgmtPct / 100))
    const admin = dollars(goi * (d.adminPct / 100))
    const opex = mgmt + admin + other
    return { pri, vacancy, goi, mgmt, admin, other, opex, noi: goi - opex }
  })
}
