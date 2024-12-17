import { useTranslations } from "next-intl";

const Not = () => {
  const t = useTranslations("not_found");
  return (
    <div className="capitalize h-[70vh] flex items-center justify-center font-black text-[24px]">
      {t("not_found")}
    </div>
  );
};

export default Not;
