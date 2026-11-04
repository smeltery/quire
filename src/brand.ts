import brandJson from '../brand.json'

export interface Brand {
  name: string
  wordmark: string
  description: string
  homepage: string
  repository: string
  branch: string
  logo: string
  ogImage: string
  nav: { label: string; href: string }[]
  groups: string[]
  popular: string[]
  searchHint: string
  theme: Record<string, string>
}

export const brand: Brand = brandJson

/** CSS custom properties for every theme token, injected into `:root`. */
export function themeCss(theme: Record<string, string>) {
  const tokens = Object.entries(theme).map(
    ([key, value]) => `--${key}:${value}`,
  )
  return `:root{${tokens.join(';')}}`
}
