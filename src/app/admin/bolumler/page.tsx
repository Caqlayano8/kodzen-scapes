import { getLevels } from "@/app/actions/admin";
import LevelManagement from "./LevelManagement";

export default async function LevelsPage() {
  const levels = await getLevels();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Bolum Yonetimi</h1>
      <LevelManagement levels={levels} />
    </div>
  );
}
