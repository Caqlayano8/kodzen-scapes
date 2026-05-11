import { getAds } from "@/app/actions/admin";
import AdManagement from "./AdManagement";

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Reklam Yonetimi</h1>
      <AdManagement ads={ads} />
    </div>
  );
}
