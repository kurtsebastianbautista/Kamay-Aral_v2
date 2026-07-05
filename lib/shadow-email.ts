export const SHADOW_EMAIL_DOMAIN = 'students.kamayaral.local'

export function shadowEmailFor(username: string) {
  return `${username.trim().toLowerCase()}@${SHADOW_EMAIL_DOMAIN}`
}

export function isShadowEmail(email: string) {
  return email.toLowerCase().endsWith(`@${SHADOW_EMAIL_DOMAIN}`)
}
