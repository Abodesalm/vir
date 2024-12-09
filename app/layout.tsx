import type { Metadata } from "next";
import "@/public/css/globals.css";
import Navbar from "@/sections/Navbar";
import ToUp from "@/components/ToUp";
import Providers from "./Providers";
import Sidebar from "@/sections/Sidebar";
import { Locale, i18n } from "@/i18n.config";
import { getSession } from "@/actions";
import Signin from "@/sections/Signin";

export const metadata: Metadata = {
  title: "Virgo",
  description: "A system for hajj and umrah subsicriptions",
};
/* 
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
} */

export default async function Layout({
  children,
}: //params,
Readonly<{
  children: React.ReactNode;
  //params: { lang: Locale };
}>) {
  //const lang = params.lang;
  const { isLoged } = await getSession();

  return (
    <html lang={"en"}>
      <body>
        <Providers>
          <Navbar lang={"en"} />
          <div className="flex flex-row w-full">
            {isLoged ? (
              <>
                <Sidebar lang={"en"} />
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

/* import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  //ts-ignore locales are readonly
  const locales = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}/`
  );
  //redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  // matcher ignoring '/_next/' and '/api/'
  matcher: [`/((?!api|favicon.ico|_next/static|_next/image).*)`],
};
 */
