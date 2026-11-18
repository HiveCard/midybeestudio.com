export interface Feature {
  title: string
  body: string
}

export const hivecard = {
  name: 'HiveCard',
  tagline: 'Privacy-first credit card manager',
  status: 'Live on Google Play',
  summary:
    'Track balances, plan payments, and reach your debt-free date — all without handing your financial data to anyone. Built for Philippine cardholders and OFWs.',
  site: 'https://hivecard.ph',
  features: [
    {
      title: 'Import in seconds',
      body: 'Drop in your statement PDF from 10+ Philippine banks. HiveCard reads it and organizes everything automatically.',
    },
    {
      title: 'See what to pay',
      body: "Smart payment plans show exactly how to clear your balance and the date you'll finally be debt-free.",
    },
    {
      title: 'Stay private',
      body: 'Everything is encrypted and stored on your device. No bank login, no cloud, no one selling your data.',
    },
    {
      title: 'Never miss a due date',
      body: 'Track dues across every card and plan payments around your income, so late fees stop catching you off guard.',
    },
  ] as Feature[],
}

export const hivelink = {
  name: 'HiveLink',
  tagline: 'The live map of your motorcycle group',
  status: 'Internal testing · Coming soon to Google Play',
  summary:
    "The ride is better when nobody gets lost. HiveLink puts your whole group on one live map — distance, direction, who's up front, who's falling behind — the moment you set off. No accounts. No history. Just the ride.",
  playStoreUrl: null as string | null, // set after Internal Testing opt-in URL is live
  features: [
    {
      title: 'One code starts the ride.',
      body: 'Pick a name. Share a 6-character code. Everyone sees everyone the second they join. Up to 20 riders per session.',
    },
    {
      title: 'See the whole pack at a glance.',
      body: 'A dark HUD map with a color per rider. Live distance to each one. Pack-order rank when a destination is set. Chevrons showing where each rider is heading.',
    },
    {
      title: 'Talk without stopping.',
      body: 'Push-to-talk voice between session members, like a helmet intercom that works at any distance. One-tap signals for STOP, CAUTION, FUEL, LOW BATT. Group chat for everything else.',
    },
    {
      title: 'Your tilt, saved.',
      body: "Live lean angle next to your speed. Peak lean saved per ride in four zones: cruising, spirited, aggressive, track pace. Guards so parking-lot wobbles don't count against you.",
    },
  ] as Feature[],
  privacyPromises: [
    'Anonymous auth. No email, no phone number, no social login.',
    "Positions overwrite in place. There's no server-side history to subpoena.",
    'Session rooms delete within a minute of the ride ending.',
    'No ads. No analytics on your location, session codes, or names. No data to sell.',
  ] as string[],
}
