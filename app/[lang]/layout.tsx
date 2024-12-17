import type { Metadata } from "next";
import "@/public/css/globals.css";
import Navbar from "@/sections/Navbar";
import ToUp from "@/components/ToUp";
import Providers from "./Providers";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthenticatedApp from "./AuthenticatedApp";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Virgo",
  description: "A system for hajj and umrah subsicriptions",
};

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;
  const messages = await getMessages();
  return (
    <html lang={lang}>
      <body>
        <Providers locale={lang} messages={messages}>
          <Navbar />
          <div className="flex flex-row w-full">
            {
              <AuthProvider>
                <AuthenticatedApp>{children}</AuthenticatedApp>
              </AuthProvider>
            }
          </div>
          <ToUp />
        </Providers>
      </body>
    </html>
  );
}
