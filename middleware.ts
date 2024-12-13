import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ar", "de", "fr"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|ar|de|fr)/:path*"],
};
