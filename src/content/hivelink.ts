/** HiveLink privacy policy content.
 *
 *  Single source of truth for the policy page. Any user-visible promise
 *  the app makes that we also surface here needs to match reality, and
 *  the Play Store data-safety declaration needs to match what's here —
 *  reviewer alignment check. See
 *  wayflock/docs/06-privacy-and-security.md for the engineering-side
 *  threat model.
 */

export const hivelinkPrivacyMeta = {
  lastUpdated: '18 November 2026',
  packageName: 'com.midybee.hivelink',
  dataController: 'MIDYBEE SOLUTIONS OPC',
  dataControllerLocation: 'Olongapo, Philippines',
  contactEmail: 'hello@midybee.com',
}

export interface DataCollectedRow {
  what: string
  whatSub?: string
  when: string
  why: string
  whoSees: string
}

export const dataCollected: DataCollectedRow[] = [
  {
    what: 'Precise location',
    whatSub: 'latitude, longitude, heading, speed, accuracy, timestamp',
    when: 'Only while you’re in an active ride session you joined',
    why: 'Draw everyone on the group’s shared minimap; compute distance and ETA to riders and destinations',
    whoSees: 'Other members of the same session. Nobody else.',
  },
  {
    what: 'Display name and color',
    when: 'You set these; shared while in a session',
    why: 'So your friends know which dot is you',
    whoSees: 'Other members of the same session',
  },
  {
    what: 'Anonymous user ID',
    whatSub: 'Firebase anonymous auth',
    when: 'Assigned by Firebase on first launch',
    why: 'Authorize your own writes to the ride session; nothing more',
    whoSees: 'Our backend (Firebase). Not tied to any name, email, or phone.',
  },
  {
    what: 'Push-to-talk voice',
    when: 'Only while you hold the PTT button in an active session',
    why: 'Real-time voice chat with your group',
    whoSees: 'Other members of the same session, in real time. Not recorded.',
  },
  {
    what: 'Signal taps + chat text',
    whatSub: 'STOP, CAUTION, FUEL, LOW BATT, free-text CHAT',
    when: 'When you tap a signal or send chat',
    why: 'Communicate with the group',
    whoSees: 'Other members of the same session',
  },
  {
    what: 'Ride stats on your phone only',
    whatSub: 'duration, distance, max speed, max lean, finish rank, idle time',
    when: 'Captured during a ride; saved on your phone after',
    why: 'Show you a ride summary and recent-rides history',
    whoSees: 'Nobody but you. Never uploaded.',
  },
]

export const neverCollected: string[] = [
  'No email, phone number, or social login.',
  'No location when you’re not in a ride session.',
  'No contacts, photos, calendar, or ad ID.',
  'No advertising SDKs. No ads in the app.',
  'No coordinates, session codes, or display names sent to analytics or crash reporting.',
]

export interface RetentionRow {
  data: string
  kept: string
}

export const retention: RetentionRow[] = [
  {
    data: 'Your live location',
    kept: 'Only while the session is active. Deleted within 60 seconds of session end, and never later than 24 hours after it started.',
  },
  {
    data: 'Session room (name, code, member list)',
    kept: 'Deleted when the session ends.',
  },
  {
    data: 'Your display name and color',
    kept: 'On your phone only, until you change them.',
  },
  {
    data: 'Anonymous user ID',
    kept: 'Until you tap “Reset identity” in Settings, or uninstall the app.',
  },
  {
    data: 'Ride stats (duration, lean, etc.)',
    kept: 'On your phone only. Delete anytime via Settings → Clear ride history.',
  },
  {
    data: 'Crash reports (if enabled)',
    kept: '30 days, with no location data included.',
  },
]

export interface Right {
  title: string
  body: string
}

export const rights: Right[] = [
  {
    title: 'Leave anytime',
    body: 'Ending or leaving a ride instantly stops sharing your location. Leaving is visible to the rest of the group.',
  },
  {
    title: 'Reset identity',
    body: 'Settings → Reset identity clears your saved name, color, anonymous ID, and preferences. The next session starts fresh.',
  },
  {
    title: 'Clear ride history',
    body: 'Settings → Ride history → Clear. Removes every saved ride summary from your phone.',
  },
  {
    title: 'Request deletion',
    body: 'Email us to confirm any residual data tied to your anonymous ID has been purged.',
  },
]

export interface ThirdParty {
  name: string
  purpose: string
  dataSent: string
  policyUrl?: string
}

export const thirdParties: ThirdParty[] = [
  {
    name: 'Firebase (Google)',
    purpose:
      'Hosts the live session: your anonymous auth, the real-time position sync, and the room metadata. Region: asia-southeast1.',
    dataSent: 'Authenticated ride data as described above.',
    policyUrl: 'https://firebase.google.com/support/privacy',
  },
  {
    name: 'Google Maps SDK for Android',
    purpose: 'Map tiles for the HUD.',
    dataSent:
      'Viewport coordinates and an API key tied to our app. No session code, no user ID, no display name.',
    policyUrl: 'https://policies.google.com/privacy',
  },
  {
    name: 'OSM Overpass (overpass-api.de)',
    purpose: 'Fetch nearby fuel stops when you tap the FUEL chip.',
    dataSent:
      'A bounding box around your current position and a generic HiveLink/1.0 user-agent. No user ID, no session code, no display name.',
  },
]

export const permissions: { title: string; body: string }[] = [
  {
    title: 'Precise location',
    body: 'Required to draw you on the group’s minimap. Requested when you join a session; shared only while the session is active.',
  },
  {
    title: 'Foreground service (location type)',
    body: 'Keeps your position syncing to your group while the screen is off or you’re using a navigation app. Announced by a persistent “Ride active” notification. Stops when you leave or end the session.',
  },
  {
    title: 'Microphone',
    body: 'Optional. Only used while you hold the push-to-talk button. Voice is sent in real time to other members and not recorded.',
  },
  {
    title: 'Notifications',
    body: 'Required to show the “Ride active” notification while location is syncing.',
  },
  {
    title: 'Camera',
    body: 'Optional. Only used when you tap “Scan” to scan a session QR code.',
  },
  {
    title: 'Background location',
    body: 'Not requested.',
  },
]
