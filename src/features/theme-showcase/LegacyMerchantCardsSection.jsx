import MerchantCardsGrid from "./MerchantCardsGrid";

function LegacyMerchantCardsSection({ hoverPreviewSize = 260, merchants }) {
  return <MerchantCardsGrid hoverPreviewSize={hoverPreviewSize} merchants={merchants} />;
}

export default LegacyMerchantCardsSection;
