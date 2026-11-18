export interface NavLink {
  label: string
  path: string
}

export const navLinks: NavLink[] = [
  { label: 'Company', path: '/studio' },
  { label: 'Products', path: '/work' },
  { label: 'Contact', path: '/contact' },
]

export const siteMeta = {
  name: 'midybee studio',
  description: 'Midybee Studio is an independent software company in Olongapo, Philippines. We build HiveCard for Philippine cardholders and HiveLink for motorcycle groups worldwide.',
  legalName: 'MIDYBEE SOLUTIONS OPC',
  domain: 'midybeestudio.com',
  url: 'https://midybeestudio.com',
  location: 'Olongapo, Philippines',
  email: 'hello@midybee.com',
  facebook: 'https://www.facebook.com/HiveCardApp',
} as const
