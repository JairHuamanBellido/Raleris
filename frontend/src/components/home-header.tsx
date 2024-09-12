import { useUserStore } from "@/store/user.store";

export default function HomeHeader() {
  const { username } = useUserStore();
  return (
    <header className="w-full h-16 p-4">
      <p>Username: {username}</p>
    </header>
  );
}
