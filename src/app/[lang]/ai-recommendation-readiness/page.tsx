import { permanentRedirect } from "next/navigation";

const PRODUCT_VISIBILITY_URL = "https://product-visibility.vercel.app/";

export default function AiRecommendationReadinessPage() {
  permanentRedirect(PRODUCT_VISIBILITY_URL);
}
