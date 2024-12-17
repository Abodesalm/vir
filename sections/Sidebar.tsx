import Icon from "@/components/Icon";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Sidebar() {
  const locale = useLocale();
  const t = useTranslations("sidebar");
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
      className={`w-[14%] bg-light/50 dark:bg-middark px-6 py-4 flex flex-col items-start gap-4 sticky top-4`}
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
