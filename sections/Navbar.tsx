import Signout from "@/components/Signout";
import Langlist from "@/components/Langlist";
import ThemeSwitch from "@/components/ThemeSwitch";
import { getSession } from "@/actions";
import { getTranslations } from "next-intl/server";

export default async function Navbar() {
  const t = await getTranslations("layoutNavbar");
  const { isLoged } = await getSession();
  return (
    <nav className="navbar">
      <div className="text-size-4 font-medium">Virgo System</div>
      <div className="flex gap-10 sm:gap-6 items-center">
        <Langlist />
        <ThemeSwitch />
        {isLoged && <Signout text={t("signout")} />}
      </div>
    </nav>
  );
}
