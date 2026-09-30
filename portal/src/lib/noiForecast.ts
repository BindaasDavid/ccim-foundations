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

export const parkPlazaTenants: TenantRow[] = [
  { name: "Tenant A, 2,200 sf", sf: 2200, rents: [24200, 24200, 24200, 25410, 25410, 26681] },
  { name: "Tenant B, 2,800 sf", sf: 2800, rents: [28000, 28000, 29400, 29400, 29400, 29400] },
  { name: "Tenant C, 2,000 sf", sf: 2000, rents: [24000, 24000, 24000, 25200, 25200, 26460] },
  { name: "Tenant D, 3,000 sf", sf: 3000, rents: [30000, 30000, 31500, 31500, 31500, 31500] },
]

export const parkPlazaDrivers: NoiDrivers = {
  vacPct: 7,
  mgmtPct: 7,
  adminPct: 1,
  stopPsf: 1.74,
  buildingSf: 10000,
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
