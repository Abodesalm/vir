import Signout from "@/components/Signout";
import Langlist from "@/components/Langlist";
import ThemeSwitch from "@/components/ThemeSwitch";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n.config";
import { getSession } from "@/actions";

export default async function Navbar({ lang }: { lang: Locale }) {
  const dic = await getDictionary(lang);
  const texts = dic.layout.navbar;
  const { isLoged } = await getSession();
  return (
    <nav className="navbar">
      <div className="text-size-4 font-medium">Virgo System</div>
      <div className="flex gap-10 sm:gap-6 items-center">
        <Langlist />
        <ThemeSwitch />
        {isLoged && <Signout text={texts.signout} />}
      </div>
    </nav>
  );
}
