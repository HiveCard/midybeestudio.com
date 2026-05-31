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
