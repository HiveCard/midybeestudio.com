interface Feature {
  title: string
  body: string
}

export const hivecard = {
  name: 'HiveCard',
  audience: 'For Philippine credit card holders',
  status: 'Available on the App Store and Google Play',
  summary: 'Import statements from supported Philippine banks, track due dates across cards, and plan how to pay down your balances. Your financial data stays on your device.',
  site: 'https://hivecard.ph',
  stores: [
    { name: 'App Store', url: 'https://apps.apple.com/ph/app/hivecard-ph/id6781399922' },
    { name: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.midybee.hivecard' },
  ],
  features: [
    {
      title: 'Import PDF statements',
      body: 'HiveCard reads statements from more than 10 Philippine banks and organizes the details for you.',
    },
    {
      title: 'Plan your payments',
      body: 'See how different payment amounts affect when you’ll pay off your balance.',
    },
    {
      title: 'Keep statements on your device',
      body: 'HiveCard encrypts your financial data on your device. You can import statements without signing in to your bank.',
    },
    {
      title: 'Track due dates',
      body: 'See upcoming payments across your cards and plan them around your income.',
    },
  ] satisfies Feature[],
}

export const hivelink = {
  name: 'HiveLink',
  tagline: 'Live maps for motorcycle groups',
  audience: 'For motorcycle groups worldwide',
  status: 'Internal testing',
  summary: 'Join a ride with a shared code, see where everyone is on a live map, and use push-to-talk or quick signals to coordinate with the group.',
  playStoreUrl: null as string | null, // Set when public installation is available.
  features: [
    {
      title: 'Join with a ride code',
      body: 'Share a six-character code with your group. Each ride session supports up to 20 riders.',
    },
    {
      title: 'See riders on a live map',
      body: 'Check each rider’s location, direction, and distance from you. With a destination set, you can also see the group’s order by progress.',
    },
    {
      title: 'Keep in touch on the road',
      body: 'Use push-to-talk, group chat, or quick signals for stops, hazards, fuel, and low battery.',
    },
    {
      title: 'Review your ride',
      body: 'See your lean angle during a ride and review your peak lean in the ride summary saved on your phone.',
    },
  ] satisfies Feature[],
}
