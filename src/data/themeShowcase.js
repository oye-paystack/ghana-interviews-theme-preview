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
import {
  danielQuoteAudioSrc,
  danielQuoteSegments,
} from "./generated/danielQuoteClip";
import {
  peadatoQuoteAudioSrc,
  peadatoQuoteSegments,
} from "./generated/peadatoQuoteClip";
import {
  sylviaQuoteAudioSrc,
  sylviaQuoteSegments,
} from "./generated/sylviaQuoteClip";
import {
  richloveQuoteAudioSrc,
  richloveQuoteSegments,
} from "./generated/richloveQuoteClip";
import {
  solomonQuoteAudioSrc,
  solomonQuoteSegments,
} from "./generated/solomonQuoteClip";
import {
  sylviaTheme4QuoteAudioSrc,
  sylviaTheme4QuoteSegments,
} from "./generated/sylviaTheme4QuoteClip";
import {
  danielTheme4QuoteAudioSrc,
  danielTheme4QuoteSegments,
} from "./generated/danielTheme4QuoteClip";
import {
  solomonTheme4QuoteAudioSrc,
  solomonTheme4QuoteSegments,
} from "./generated/solomonTheme4QuoteClip";
import {
  cathrinTheme2QuoteAudioSrc,
  cathrinTheme2QuoteSegments,
} from "./generated/cathrinTheme2QuoteClip";
import {
  felipeTheme1QuoteAudioSrc,
  felipeTheme1QuoteSegments,
} from "./generated/felipeTheme1QuoteClip";
import {
  felipeTheme4QuoteAudioSrc,
  felipeTheme4QuoteSegments,
} from "./generated/felipeTheme4QuoteClip";

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
        playbackAudioSrc: felipeTheme1QuoteAudioSrc,
        playbackQuote: {
          segments: felipeTheme1QuoteSegments,
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
        playbackAudioSrc: danielQuoteAudioSrc,
        playbackQuote: {
          segments: danielQuoteSegments,
          speakerName: "Daniel",
          speakerRole: "Dajo Unimarket",
        },
        copy: [
          "Dajo moves hundreds of thousands in daily transactions, but a single unexplained account hold can freeze the business — and at their scale, the team can't reach every affected customer by phone.",
        ],
      },
      {
        merchantId: "peadato-group",
        listenLabel: "Listen to Peadato",
        playbackAudioSrc: peadatoQuoteAudioSrc,
        playbackQuote: {
          segments: peadatoQuoteSegments,
          speakerName: "Theo & Denzel",
          speakerRole: "Peadato Group",
        },
        copy: [
          "Peadato runs payments across education, electronics, agriculture and travel. They've been asking for a dedicated account manager — and an application for a second Paystack account has been sitting for over ",
          { highlight: "two months" },
          ".",
        ],
      },
      {
        merchantId: "warc",
        listenLabel: "Listen to Cathrin",
        playbackAudioSrc: cathrinTheme2QuoteAudioSrc,
        playbackQuote: {
          segments: cathrinTheme2QuoteSegments,
          speakerName: "Cathrin",
          speakerRole: "WARC",
        },
        copy: [
          "WARC sends large payouts to farmers across northern Ghana, but reversal turnarounds of ",
          { highlight: "5–15 days" },
          " aren't keeping up. As they scale, a slow reversal can mean losing money they can't recall.",
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
        merchantId: "telecel",
        listenLabel: "Listen to Sylvia",
        playbackAudioSrc: sylviaQuoteAudioSrc,
        playbackQuote: {
          segments: sylviaQuoteSegments,
          speakerName: "Sylvia",
          speakerRole: "Product Owner, Telecel",
        },
        copy: [
          "Telecel's team described how delayed crediting forces them to work backwards from customer complaints, rather than proactively resolving issues.",
        ],
      },
      {
        merchantId: "achieve-by-petra",
        listenLabel: "Listen to Richlove",
        playbackAudioSrc: richloveQuoteAudioSrc,
        playbackQuote: {
          segments: richloveQuoteSegments,
          speakerName: "Richlove",
          speakerRole: "Operations, Achieve by Petra",
        },
        copy: [
          "Achieve's reconciliation process breaks whenever refund timing shifts settlement amounts across days — mismatches they can't explain to their own customers.",
        ],
      },
      {
        merchantId: "golly-express",
        listenLabel: "Listen to Solomon",
        playbackAudioSrc: solomonQuoteAudioSrc,
        playbackQuote: {
          segments: solomonQuoteSegments,
          speakerName: "Solomon",
          speakerRole: "Founder, Golly Express",
        },
        copy: [
          "Golly Express leans on webhook confirmations to create customer orders — when the webhook doesn't come through, the reconciliation work lands on them.",
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
        merchantId: "warc",
        listenLabel: "Listen to Felipe",
        playbackAudioSrc: felipeTheme4QuoteAudioSrc,
        playbackQuote: {
          segments: felipeTheme4QuoteSegments,
          speakerName: "Felipe",
          speakerRole: "Technical Lead, WARC",
        },
        copy: [
          "WARC's team flagged roughly 185 failed transfers where the error reason was never surfaced — they're left unable to diagnose or act, and retry becomes guesswork.",
        ],
      },
      {
        merchantId: "telecel",
        listenLabel: "Listen to Sylvia",
        playbackAudioSrc: sylviaTheme4QuoteAudioSrc,
        playbackQuote: {
          segments: sylviaTheme4QuoteSegments,
          speakerName: "Sylvia",
          speakerRole: "Product Owner, Telecel",
        },
        copy: [
          "Telecel described the moment their customer is debited, the money vanishes between Paystack and MTN, and nobody can explain where it went.",
        ],
      },
      {
        merchantId: "dajo-unimarket",
        listenLabel: "Listen to Daniel",
        playbackAudioSrc: danielTheme4QuoteAudioSrc,
        playbackQuote: {
          segments: danielTheme4QuoteSegments,
          speakerName: "Daniel",
          speakerRole: "Founder, Dajo Unimarket",
        },
        copy: [
          "On Dajo's busiest day of the year, 25,000 orders went unfulfilled — and Daniel still doesn't know whether the customers paid or the webhooks never fired.",
        ],
      },
      {
        merchantId: "golly-express",
        listenLabel: "Listen to Solomon",
        playbackAudioSrc: solomonTheme4QuoteAudioSrc,
        playbackQuote: {
          segments: solomonTheme4QuoteSegments,
          speakerName: "Solomon",
          speakerRole: "Founder, Golly Express",
        },
        copy: [
          "Solomon described glancing at the dashboard after a failure and finding no answer — just a status label and no way to tell the customer what went wrong.",
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
