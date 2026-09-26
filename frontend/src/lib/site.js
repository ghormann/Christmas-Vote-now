// Links and contact details used across the vote-now.org pages.

export const HORMANNS_SITE = 'https://thehormanns.net'
export const HORMANNS_STORY_URL = `${HORMANNS_SITE}/christmas/our-story/`

/** Technology page on thehormanns.net, e.g. techUrl('snowmen'). */
export const techUrl = (slug) => `${HORMANNS_SITE}/technology/${slug}/`

// The number visitors text their first name to.
export const TEXT_NUMBER_DISPLAY = '888-887-1423'
export const TEXT_NUMBER_SMS = 'sms:+18888871423'

/** 1 -> "1st", 22 -> "22nd", 113 -> "113th". */
export function ordinal(n) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'
  return `${n}${suffix}`
}

/** Google Maps driving directions to a display from the cooldisplays feed. */
export function directionsUrl(house) {
  const destination =
    house.lat && house.lng
      ? `${house.lat},${house.lng}`
      : [house.title, house.city, `${house.state} ${house.zip}`].join(', ')
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination)
}
