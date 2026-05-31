export interface NavLink {
  label: string
  path: string
}

export const navLinks: NavLink[] = [
  { label: 'Studio', path: '/studio' },
  { label: 'Work', path: '/work' },
  { label: 'Contact', path: '/contact' },
]

export const siteMeta = {
  name: 'midybee studio',
  legalName: 'MIDYBEE SOLUTIONS OPC',
  domain: 'midybeestudio.com',
  url: 'https://midybeestudio.com',
  location: 'Olongapo, Philippines',
  email: 'hello@midybee.com',
  facebook: 'https://www.facebook.com/HiveCardApp',
} as const
