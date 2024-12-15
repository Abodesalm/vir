"use client";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/services/auth";

export function LogoutButton() {
  const { dispatch } = useAuth();

  const handleLogout = () => {
    logout();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
