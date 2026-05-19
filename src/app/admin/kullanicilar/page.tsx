import { getUsers } from "@/app/actions/admin";
import UserManagement from "./UserManagement";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Kullanici Yonetimi</h1>
      <UserManagement users={users} />
    </div>
  );
}
