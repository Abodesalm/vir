import Button from "./Button";
import Icon from "./Icon";
import { logout } from "@/actions";

export default function Signout({ text }) {
  return (
    <form action={logout}>
      <Button style="ui-blur" className="buttonRow">
        <>
          <Icon i={"signout"} />
          <p className="capitalize text-size-5">{text}</p>
        </>
      </Button>
    </form>
  );
}
