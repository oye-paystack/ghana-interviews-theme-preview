import {
  sharonQuoteAudioSrc,
  sharonQuoteSegments,
} from "./generated/sharonQuoteClip";
import {
  ericQuoteAudioSrc,
  ericQuoteSegments,
} from "./generated/ericQuoteClip";
import {
  victorQuoteAudioSrc,
  victorQuoteSegments,
} from "./generated/victorQuoteClip";

const merchantTextureSrc = (filename) => `${import.meta.env.BASE_URL}merchant-cards/${filename}`;

// Merchant base: stable visual identity and recording metadata.
// Per-theme content (quotes, audio, copy, listen label) lives in theme.merchantSlots.
const merchantBaseById = {
  warc: {
    id: "warc",
    name: "WARC",
    navLabel: "WARC",
    iconKey: "plant",
    recordingLabel: "WARC - Ghana MI 26.02.26",
    labelPosition: { top: 26, left: 85, rotate: -0.6 },
    cardGridOrder: 1,
    cardLabel: "WARC Ghana",
    cardCategory: "Agritech (farmer payouts)",
    cardIconKey: "plant",
    cardBaseColor: "#523827",
    cardTextureSrc: merchantTextureSrc("warc-texture.webp"),
    cardTextureOpacity: 0.6,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.51%",
    cardTextureHeight: "111.36%",
    cardTextureLeft: "-5.73%",
    cardTextureTop: "-5.66%",
  },
  telecel: {
    id: "telecel",
    name: "Telecel",
    navLabel: "Telecel",
    iconKey: "airplaneTilt",
    recordingLabel: "Telecel - Ghana MI 19.03.26",
    labelPosition: { top: 27, left: 84, rotate: 0.2 },
    cardGridOrder: 2,
    cardLabel: "Telecel",
    cardCategory: "Telecommunications (bill payments)",
    cardIconKey: "cellTower",
    cardBaseColor: "#770621",
    cardTextureSrc: merchantTextureSrc("telecel-texture.webp"),
    cardTextureOpacity: 1,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.52%",
    cardTextureHeight: "111.36%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  "dajo-unimarket": {
    id: "dajo-unimarket",
    name: "Dajo Unimarket",
    navLabel: "Dajo",
    iconKey: "piggyBank",
    recordingLabel: "Dajo Unimarket - Ghana MI 14.03.26",
    labelPosition: { top: 25, left: 72, rotate: -0.2 },
    cardGridOrder: 3,
    cardLabel: "Dajo Unimarket",
    cardCategory: "Data bundles marketplace",
    cardIconKey: "cellSignalFull",
    cardBaseColor: "#4C5530",
    cardTextureSrc: merchantTextureSrc("dajo-unimarket-texture.webp"),
    cardTextureOpacity: 1,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.55%",
    cardTextureHeight: "111.38%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  "africa-world-airlines": {
    id: "africa-world-airlines",
    name: "Africa World Airlines",
    navLabel: "Africa World Airlines",
    iconKey: "airplaneTilt",
    recordingLabel: "AWA - Ghana MI 03.03.26",
    labelPosition: { top: 28, left: 88, rotate: 0.3 },
    cardGridOrder: 4,
    cardLabel: "Africa World Airlines",
    cardCategory: "Airline (domestic/regional)",
    cardIconKey: "airplaneTilt",
    cardBaseColor: "#20454D",
    cardTextureSrc: merchantTextureSrc("africa-world-airlines-texture.webp"),
    cardTextureOpacity: 1,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.53%",
    cardTextureHeight: "111.34%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  seesail: {
    id: "seesail",
    name: "Seesail",
    navLabel: "Seesail",
    iconKey: "plant",
    recordingLabel: "Seesail - Ghana MI 27.02.26",
    labelPosition: { top: 24, left: 86, rotate: -0.2 },
    cardGridOrder: 5,
    cardLabel: "Seesail",
    cardCategory: "Commerce platform / POS SaaS",
    cardIconKey: "shoppingCart",
    cardBaseColor: "#0E0801",
    cardTextureSrc: merchantTextureSrc("seesail-texture.webp"),
    cardTextureOpacity: 0.8,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.51%",
    cardTextureHeight: "111.42%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  "achieve-by-petra": {
    id: "achieve-by-petra",
    name: "Achieve by Petra",
    navLabel: "Achieve",
    iconKey: "piggyBank",
    recordingLabel: "Achieve - Ghana MI 03.03.26",
    labelPosition: { top: 24, left: 82, rotate: -0.8 },
    cardGridOrder: 6,
    cardLabel: "Petra",
    cardCategory: "Digital savings & investments app",
    cardIconKey: "piggyBank",
    cardBaseColor: "#657140",
    cardTextureSrc: merchantTextureSrc("petra-texture.webp"),
    cardTextureOpacity: 1,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.53%",
    cardTextureHeight: "111.39%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  "golly-express": {
    id: "golly-express",
    name: "Golly Express",
    navLabel: "Golly",
    iconKey: "airplaneTilt",
    recordingLabel: "Golly Express - Ghana MI 17.03.26",
    labelPosition: { top: 29, left: 78, rotate: 0.5 },
    cardGridOrder: 7,
    cardLabel: "Golly Express",
    cardCategory: "Logistics / warehouse forwarding",
    cardIconKey: "package",
    cardBaseColor: "#0C1A1D",
    cardTextureSrc: merchantTextureSrc("golly-express-texture.webp"),
    cardTextureOpacity: 1,
    cardTextureBlendMode: "plus-lighter",
    cardTextureWidth: "111.51%",
    cardTextureHeight: "111.33%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
  "peadato-group": {
    id: "peadato-group",
    name: "Peadato Group",
    navLabel: "Peadato",
    iconKey: "piggyBank",
    recordingLabel: "Peadato Group - Ghana MI 16.03.26",
    labelPosition: { top: 26, left: 80, rotate: -0.4 },
    cardGridOrder: 8,
    cardLabel: "Peadato",
    cardCategory: "Multi-vertical (education, electronics, agriculture, travel)",
    cardIconKey: "buildingApartment",
    cardBaseColor: "#E37047",
    cardTextureSrc: merchantTextureSrc("peadato-texture.webp"),
    cardTextureOpacity: 0.85,
    cardTextureBlendMode: "hard-light",
    cardTextureWidth: "111.49%",
    cardTextureHeight: "111.40%",
    cardTextureLeft: "-5.74%",
    cardTextureTop: "-5.66%",
  },
};

// Slot definitions — each (theme, merchant) pairing carries its own quote, audio, and copy.
// To add a second quote for a merchant in a different theme, add another slot in that theme.
const sharedSectionHeading =
  "We heard a few things across our conversations and we'd like you to hear them too";
const sharedSocialProofText = "We heard this from others too";

export const themeShowcaseThemes = [
  {
    id: "theme-showcase",
    indexLabel: "01",
    title: "Reliability is Paystack's most valuable asset",
    sectionHeading: sharedSectionHeading,
    socialProofText: sharedSocialProofText,
    playerPanelColor: "#91A653",
    accentColor: "#91A653",
    merchantSlots: [
      {
        merchantId: "seesail",
        listenLabel: "Listen to Victor",
        playbackAudioSrc: victorQuoteAudioSrc,
        playbackQuote: {
          segments: victorQuoteSegments,
          speakerName: "Victor",
          speakerRole: "Founder, Seesail",
        },
        copy: [
          "Seesail's founder Victor moved his commerce platform to Paystack because of its ",
          { highlight: "matured API" },
          " — calling it the most reliable option for handling live transaction traffic.",
        ],
      },
      {
        merchantId: "africa-world-airlines",
        listenLabel: "Listen to Eric",
        playbackAudioSrc: ericQuoteAudioSrc,
        playbackQuote: {
          segments: ericQuoteSegments,
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
        merchantId: "warc",
        listenLabel: "Listen to Felipe",
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
    ],
  },
  {
    id: "theme-showcase-support",
    indexLabel: "02",
    title: "Merchants are growing faster than the support around them",
    sectionHeading: sharedSectionHeading,
    socialProofText: sharedSocialProofText,
    playerPanelColor: "#F76C4D",
    accentColor: "#F76C4D",
    eyebrowColor: "#A13C25",
    merchantSlots: [
      {
        merchantId: "dajo-unimarket",
        listenLabel: "Listen to Daniel",
        playbackQuote: {
          lead: "We have a lot of users in our system, a lot, a lot.",
          rest: " So we cannot solve all the issues by calling. And some of the customers will not even try to call again.",
          speakerName: "Daniel",
          speakerRole: "Dajo Unimarket",
        },
        copy: [
          "Dajo is growing quickly, but merchant support and account operations still require too much manual follow-up as volume increases.",
        ],
      },
      {
        merchantId: "telecel",
        listenLabel: "Listen to Alex",
        playbackQuote: {
          lead: "My customer is saying they've been debited, their money is gone.",
          rest: " We reach out to you and you tell us you don't have any way of reaching out to MTN or whichever the third party may be. So we should tell our customer to reach out to them.",
          speakerName: "Alex",
          speakerRole: "Digital Transformation Lead, Telecel",
        },
        copy: [
          "Telecel highlighted how quickly merchant trust drops when payment issues are hard to trace or explain in the moment.",
        ],
      },
      {
        merchantId: "seesail",
        listenLabel: "Listen to Victor",
        playbackQuote: {
          lead: "Those periods were very foggy times.",
          rest: " Paystack yanked me off card payments — I'd never had callbacks on card payments. What happened?",
          speakerName: "Victor",
          speakerRole: "Founder, Seesail",
        },
        copy: [
          "Seesail pointed to the widening gap between merchant growth and the support structures available to help them scale confidently.",
        ],
      },
    ],
  },
  {
    id: "theme-showcase-reconciliation",
    indexLabel: "03",
    title: "Reconciliation is still too manual, and it's costing merchant trust",
    sectionHeading: sharedSectionHeading,
    socialProofText: sharedSocialProofText,
    playerPanelColor: "#409599",
    accentColor: "#409599",
    eyebrowColor: "#409599",
    merchantSlots: [
      {
        merchantId: "achieve-by-petra",
        listenLabel: "Listen to Sharon",
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
        merchantId: "golly-express",
        listenLabel: "Listen to Solomon",
        playbackQuote: {
          lead: "We just glance at the dashboard, but we don't get enough info.",
          rest: " It just tells us that it's failed. So we don't really know what happened.",
          speakerName: "Solomon",
          speakerRole: "Founder, Golly Express",
        },
        copy: [
          "Golly Express described reconciliation work as one of the places where operational strain becomes most visible to the business.",
        ],
      },
      {
        merchantId: "peadato-group",
        listenLabel: "Listen to Hezekiah",
        playbackQuote: {
          lead: "At the end of the month, you would have to compile a list and send it to your banks for them to disburse at their end.",
          rest: " Doing it at our end comes with a cost.",
          speakerName: "Hezekiah",
          speakerRole: "Finance Officer, Peadato Group",
        },
        copy: [
          "Peadato Group's multi-vertical setup makes reconciliation friction especially costly because mismatches ripple across several business lines.",
        ],
      },
    ],
  },
  {
    id: "theme-showcase-opaque",
    indexLabel: "04",
    title: "When payments fail, merchants are left without answers",
    sectionHeading: sharedSectionHeading,
    socialProofText: sharedSocialProofText,
    playerPanelColor: "#DE475E",
    accentColor: "#DE475E",
    eyebrowColor: "#DE475E",
    merchantSlots: [
      {
        merchantId: "africa-world-airlines",
        listenLabel: "Listen to Eric",
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
        merchantId: "telecel",
        listenLabel: "Listen to Alex",
        playbackQuote: {
          lead: "My customer is saying they've been debited, their money is gone.",
          rest: " We reach out to you and you tell us you don't have any way of reaching out to MTN or whichever the third party may be. So we should tell our customer to reach out to them.",
          speakerName: "Alex",
          speakerRole: "Digital Transformation Lead, Telecel",
        },
        copy: [
          "Telecel highlighted how quickly merchant trust drops when payment issues are hard to trace or explain in the moment.",
        ],
      },
      {
        merchantId: "seesail",
        listenLabel: "Listen to Victor",
        playbackQuote: {
          lead: "Those periods were very foggy times.",
          rest: " Paystack yanked me off card payments — I'd never had callbacks on card payments. What happened?",
          speakerName: "Victor",
          speakerRole: "Founder, Seesail",
        },
        copy: [
          "Seesail pointed to the widening gap between merchant growth and the support structures available to help them scale confidently.",
        ],
      },
    ],
  },
];

export const themeShowcaseTheme = themeShowcaseThemes[0];

// Build per-theme merchant arrays by merging slot data into the merchant base.
// Components consume merchants from these arrays — they get a single flat object
// containing both visual identity and per-theme content.
function buildThemeMerchants(theme) {
  return (theme.merchantSlots ?? [])
    .map((slot) => {
      const base = merchantBaseById[slot.merchantId];
      if (!base) {
        return null;
      }
      return { ...base, ...slot, id: base.id };
    })
    .filter(Boolean);
}

export const themeShowcaseMerchantsByThemeId = Object.fromEntries(
  themeShowcaseThemes.map((theme) => [theme.id, buildThemeMerchants(theme)]),
);

export const themeShowcaseMerchants =
  themeShowcaseMerchantsByThemeId[themeShowcaseTheme.id] ?? [];

// All merchants for the merchant-cards section (no theme-specific content).
// Sorted by cardGridOrder so consumers can rely on the visual layout order.
export const allThemeShowcaseMerchants = Object.values(merchantBaseById).sort(
  (a, b) => (a.cardGridOrder ?? 0) - (b.cardGridOrder ?? 0),
);

export const merchantById = merchantBaseById;
