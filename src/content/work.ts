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
  tagline: 'Live group minimap for motorcycle convoys',
  status: 'Internal testing · Coming soon to Google Play',
  summary:
    'HiveLink is a live group minimap for motorcycle and convoy rides. Your group joins a session by a 6-character code; everyone sees everyone on a dark HUD map with distance, pack order, and ETA. No accounts, no history, nothing stored after the ride ends.',
  playStoreUrl: null as string | null, // set after Internal Testing opt-in URL is live
  features: [
    {
      title: 'Join by code',
      body: 'Six-character session code, up to 20 riders, anonymous auth. No email, no phone, no social login — pick a name, join a ride, done.',
    },
    {
      title: 'See the whole pack',
      body: 'Dark HUD map with a color per rider, live distance chips, pack-order rank when a destination is set, and chevrons that show where every rider is heading.',
    },
    {
      title: 'Talk without stopping',
      body: 'Push-to-talk voice between session members. One-tap signals for STOP, CAUTION, FUEL, LOW BATT. Group chat for the rest.',
    },
    {
      title: 'Live lean + ride recap',
      body: 'Tilt indicator next to your KPH while you ride. Peak lean saved per ride in four zones — cruising, spirited, aggressive, track pace. One-tap share of the ride summary PNG.',
    },
  ] as Feature[],
  privacyPromises: [
    'No server-side location history. Ever.',
    'Session rooms deleted within 60 seconds of the ride ending.',
    'No email, no phone number, no social login. Anonymous auth only.',
    'No ads SDK. No analytics on coordinates, session codes, or names.',
  ] as string[],
}
