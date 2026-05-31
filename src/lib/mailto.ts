export interface MailtoInput {
  to: string
  name: string
  email: string
  message: string
}

/** Build a mailto: URL from contact fields, or null if the message is blank. */
export function buildMailto({ to, name, email, message }: MailtoInput): string | null {
  if (!message.trim()) return null
  const subject = encodeURIComponent(`midybee inquiry${name ? ' from ' + name : ''}`)
  const body = encodeURIComponent(
    `${message}${email ? '\n\nReply to: ' + email : ''}${name ? '\n— ' + name : ''}`,
  )
  return `mailto:${to}?subject=${subject}&body=${body}`
}
