import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { activeRole } = useAuth();

  return activeRole === "empresa" ? (
    <Redirect href="/empresa/(tabs)" />
  ) : (
    <Redirect href="/promotor/(tabs)" />
  );
}