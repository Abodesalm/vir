import { useTranslations } from "next-intl";
import Button from "./Button";
import Icon from "./Icon";
import { logout } from "@/actions";
import { useAuth } from "@/contexts/AuthContext";

export default function Signout() {
  const t = useTranslations("navbar");
  const { dispatch } = useAuth();

  const handleLogout = () => {
    logout();
    dispatch({ type: "LOGOUT" });
  };
  return (
    <Button action={handleLogout} style="ui-blur" className="buttonRow">
      <>
        <Icon i={"signout"} />
        <p className="capitalize text-size-5">{t("signout")}</p>
      </>
    </Button>
  );
}
