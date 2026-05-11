import { getGameSettings } from "@/app/actions/admin";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getGameSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Oyun Ayarlari</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
