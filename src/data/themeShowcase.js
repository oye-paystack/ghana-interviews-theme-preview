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
  },
  {
    id: "theme-showcase-reconciliation",
    indexLabel: "03",
    title: "Reconciliation is still too manual, and it's costing merchant trust",
    sectionHeading: themeShowcaseTheme.sectionHeading,
    socialProofText: themeShowcaseTheme.socialProofText,
    playerPanelColor: "#0C1A1D",
  },
  {
    id: "theme-showcase-opaque",
    indexLabel: "04",
    title: "When payments fail, merchants are left without answers",
    sectionHeading: themeShowcaseTheme.sectionHeading,
    socialProofText: themeShowcaseTheme.socialProofText,
    playerPanelColor: "#F76C4D",
  },
];

export const themeShowcaseMerchants = [
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
];
