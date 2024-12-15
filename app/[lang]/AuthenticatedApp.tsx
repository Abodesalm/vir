"use client";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/sections/Sidebar";
import Signin from "@/sections/Signin";

export default function AuthenticatedApp({ children }) {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="loader text-accent"></div>
      </div>
    );
  }

  return state.isAuthenticated ? (
    <>
      <Sidebar />
      <div
        className={`${
          state.isAuthenticated ? "w-[86%]" : "w-full"
        } side-pad min-h-[80vh]`}
      >
        {children}
      </div>
    </>
  ) : (
    <Signin />
  );
}
