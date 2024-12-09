/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["zed-games-api.onrender.com"],
  },
  i18n: {
    locales: ["en", "ar", "fr", "de"],
    defaultLocale: "en",
  },
};

export default nextConfig;
