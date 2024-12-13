import { getSession } from "@/actions";
import Icon from "@/components/Icon";
import { getTranslations, getLocale } from "next-intl/server";
import { useLocale } from "next-intl";
import Link from "next/link";

export default async function Sidebar() {
  const locale = await getLocale();
  const t = await getTranslations("layoutSidebar");
  const { isLoged } = await getSession();
  const options = [
    { path: `/${locale}`, icon: "stats", text: t("statistics") },
    { path: `/${locale}/processor`, icon: "processor", text: t("processor") },
    { path: `/${locale}/documents`, icon: "docs", text: t("documents") },
    {
      path: `/${locale}/settings`,
      icon: "settingsFill",
      text: t("settings"),
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
