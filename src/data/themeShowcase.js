import {
  sharonQuoteAudioSrc,
  sharonQuoteSegments,
} from "./generated/sharonQuoteClip";

export const themeShowcaseTheme = {
  id: "theme-showcase",
  indexLabel: "01",
  title: "Reliability is Paystack's most valuable asset",
  sectionHeading:
    "We heard a few things across our conversations and we'd like you to hear them too",
  socialProofText: "We heard this from others too",
  playerPanelColor: "#657140",
  merchantIds: ["achieve-by-petra", "africa-world-airlines", "warc"],
};

export const themeShowcaseThemes = [
  themeShowcaseTheme,
  {
    id: "theme-showcase-support",
    indexLabel: "02",
    title: "Merchants are growing faster than the support around them",
    sectionHeading: themeShowcaseTheme.sectionHeading,
    socialProofText: themeShowcaseTheme.socialProofText,
    playerPanelColor: "#4A0113",
    merchantIds: ["dajo-unimarket", "telecel", "seesail"],
  },
  {
    id: "theme-showcase-reconciliation",
    indexLabel: "03",
    title: "Reconciliation is still too manual, and it's costing merchant trust",
    sectionHeading: themeShowcaseTheme.sectionHeading,
    socialProofText: themeShowcaseTheme.socialProofText,
    playerPanelColor: "#0C1A1D",
    merchantIds: ["achieve-by-petra", "golly-express", "peadato-group"],
  },
  {
    id: "theme-showcase-opaque",
    indexLabel: "04",
    title: "When payments fail, merchants are left without answers",
    sectionHeading: themeShowcaseTheme.sectionHeading,
    socialProofText: themeShowcaseTheme.socialProofText,
    playerPanelColor: "#F76C4D",
    merchantIds: ["africa-world-airlines", "telecel", "seesail"],
  },
];

export const allThemeShowcaseMerchants = [
  {
    id: "achieve-by-petra",
    name: "Achieve by Petra",
    navLabel: "Achieve",
    recordingLabel: "ACH - Ghana MI 11.03.26",
    listenLabel: "Listen to Sharon",
    iconKey: "piggyBank",
    playbackAudioSrc: sharonQuoteAudioSrc,
    playbackQuote: {
      segments: sharonQuoteSegments,
      speakerName: "Sharon",
      speakerRole: "Tech Lead, Achieve by Petra",
    },
    copy: [
      "Achieve moved from manual virtual account workflows to instant transfers and saw a ",
      { highlight: "100%" },
      " success rate on completed Paystack transactions.",
    ],
  },
  {
    id: "africa-world-airlines",
    name: "Africa World Airlines",
    navLabel: "Africa World Airlines",
    recordingLabel: "AWA - Ghana MI 18.03.26",
    listenLabel: "Listen to Eric",
    iconKey: "airplaneTilt",
    playbackQuote: {
      lead: "People are comfortable because it's available",
      rest: ", and when others feel they are able to rely on it.",
      speakerName: "Eric",
      speakerRole: "IT Team, Africa World Airlines",
    },
    copy: [
      "AWA's payment volume through Paystack grew ",
      { highlight: "4x" },
      " in 2025. Eric, from AWA's IT team, was clear about why",
    ],
  },
  {
    id: "warc",
    name: "WARC",
    navLabel: "WARC",
    recordingLabel: "WARC - Ghana MI 18.03.26",
    listenLabel: "Listen to Felipe",
    iconKey: "plant",
    playbackQuote: {
      lead: "We obtained almost 97% of success.",
      rest: " And we have, more or less, a 3% of failed transactions.",
      speakerName: "Felipe",
      speakerRole: "Technical Lead, WARC",
    },
    copy: [
      "WARC used Paystack Transfers to pay thousands of farmers and reported roughly a ",
      { highlight: "97%" },
      " success rate in northern Ghana's tougher network conditions.",
    ],
  },
  {
    id: "dajo-unimarket",
    name: "Dajo Unimarket",
    navLabel: "Dajo",
    recordingLabel: "DAJO - Ghana MI 14.03.26",
    listenLabel: "Listen to Daniel",
    iconKey: "piggyBank",
    playbackQuote: {
      lead: "Our business is growing faster than the support systems around us.",
      rest: " We need tools that keep up without adding more operational overhead.",
      speakerName: "Daniel",
      speakerRole: "Dajo Unimarket",
    },
    copy: [
      "Dajo is growing quickly, but merchant support and account operations still require too much manual follow-up as volume increases.",
    ],
  },
  {
    id: "telecel",
    name: "Telecel",
    navLabel: "Telecel",
    recordingLabel: "TEL - Ghana MI 17.03.26",
    listenLabel: "Listen to Alex",
    iconKey: "airplaneTilt",
    playbackQuote: {
      lead: "When a payment fails, the merchant needs an answer immediately.",
      rest: " Otherwise trust drops before anyone even understands what happened.",
      speakerName: "Alex",
      speakerRole: "Digital Transformation Lead, Telecel",
    },
    copy: [
      "Telecel highlighted how quickly merchant trust drops when payment issues are hard to trace or explain in the moment.",
    ],
  },
  {
    id: "seesail",
    name: "Seesail",
    navLabel: "Seesail",
    recordingLabel: "SEA - Ghana MI 19.03.26",
    listenLabel: "Listen to Victor",
    iconKey: "plant",
    playbackQuote: {
      lead: "Support needs to feel close to the merchant's day-to-day reality.",
      rest: " Otherwise growth starts to expose every operational gap.",
      speakerName: "Victor",
      speakerRole: "Seesail",
    },
    copy: [
      "Seesail pointed to the widening gap between merchant growth and the support structures available to help them scale confidently.",
    ],
  },
  {
    id: "golly-express",
    name: "Golly Express",
    navLabel: "Golly",
    recordingLabel: "GOL - Ghana MI 12.03.26",
    listenLabel: "Listen to Solomon",
    iconKey: "airplaneTilt",
    playbackQuote: {
      lead: "Reconciliation is where confidence starts to break down.",
      rest: " If the records do not line up quickly, merchants feel exposed.",
      speakerName: "Solomon",
      speakerRole: "Golly Express",
    },
    copy: [
      "Golly Express described reconciliation work as one of the places where operational strain becomes most visible to the business.",
    ],
  },
  {
    id: "peadato-group",
    name: "Peadato Group",
    navLabel: "Peadato",
    recordingLabel: "PEA - Ghana MI 15.03.26",
    listenLabel: "Listen to Denzel",
    iconKey: "piggyBank",
    playbackQuote: {
      lead: "The more manual reconciliation becomes, the harder it is to keep trust across teams.",
      rest: " That friction compounds when the business spans multiple verticals.",
      speakerName: "Denzel",
      speakerRole: "Peadato Group",
    },
    copy: [
      "Peadato Group's multi-vertical setup makes reconciliation friction especially costly because mismatches ripple across several business lines.",
    ],
  },
];

export const merchantById = Object.fromEntries(
  allThemeShowcaseMerchants.map((merchant) => [merchant.id, merchant]),
);

export const themeShowcaseMerchants = themeShowcaseTheme.merchantIds.map(
  (merchantId) => merchantById[merchantId],
);

export const themeShowcaseMerchantsByThemeId = Object.fromEntries(
  themeShowcaseThemes.map((theme) => [
    theme.id,
    (theme.merchantIds ?? []).map((merchantId) => merchantById[merchantId]).filter(Boolean),
  ]),
);
