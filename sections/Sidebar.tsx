import { getSession } from "@/actions";
import Icon from "@/components/Icon";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/dictionary";
import Link from "next/link";

export default async function Sidebar({ lang }: { lang: Locale }) {
  const { layout } = await getDictionary(lang);
  const texts = layout.sidebar;
  const { isLoged } = await getSession();
  const options = [
    { path: `/${lang}`, icon: "stats", text: texts.statistics },
    { path: `/${lang}/processor`, icon: "processor", text: texts.processor },
    { path: `/${lang}/documents`, icon: "docs", text: texts.documents },
    {
      path: `/${lang}/settings`,
      icon: "settingsFill",
      text: texts.settings,
      className: "mt-12",
    },
  ];
  return (
    <div
      className={`w-[14%] bg-light/50 dark:bg-middark px-6 py-4 flex flex-col items-start gap-4 sticky top-4  ${
        isLoged ? "" : "hidden"
      }`}
    >
      {options.map((el) => {
        return (
          <Option
            path={el.path}
            icon={<Icon i={el.icon} className="text-[18px]" />}
            text={el.text}
            className={el.className}
            key={el.text}
          />
        );
      })}
    </div>
  );
}

const Option = ({ path, icon, text, className = "" }) => {
  return (
    <Link
      href={path}
      className={`btn-ui w-full capitalize flex flex-row items-center gap-2  ${className}`}
    >
      {icon}
      <p>{text}</p>
    </Link>
  );
};
