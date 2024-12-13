import type { Metadata } from "next";
import "@/public/css/globals.css";
import Navbar from "@/sections/Navbar";
import ToUp from "@/components/ToUp";
import Providers from "./Providers";
import Sidebar from "@/sections/Sidebar";
import { getSession } from "@/actions";
import Signin from "@/sections/Signin";

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
  const { isLoged } = await getSession();
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>
        <Providers>
          <Navbar />
          <div className="flex flex-row w-full">
            {isLoged ? (
              <>
                <Sidebar />
                <div
                  className={`${
                    isLoged ? "w-[86%]" : "w-full"
                  } side-pad min-h-[80vh]`}
                >
                  {children}
                </div>
              </>
            ) : (
              <Signin />
            )}
          </div>
          <ToUp />
        </Providers>
      </body>
    </html>
  );
}
