"use client";

import { useState, useTransition } from "react";
import Button from "./Button";
import Icon from "./Icon";
import { usePathname, useRouter } from "next/navigation";

const langs = [
  { name: "English", code: "en" },
  { name: "Arabic", code: "ar" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
];

export default function Langlist() {
  const Locale = usePathname().split("/")[1];

  const activeLocale = langs.find((el) => {
    return el.code === Locale;
  });

  const [selectedLang, setSelectedLang] = useState<string | undefined>(
    activeLocale?.name
  );
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        style="ui-blur"
        action={() => {
          setOpened(!opened);
        }}
        className="buttonRow"
      >
        <>
          <p className="capitalize">{selectedLang}</p>
          <Icon i={"downArrow"} />
        </>
      </Button>
      {opened && (
        <div className="dropdown">
          {langs.map((el) => {
            return (
              <Item
                key={el.code}
                code={el.code}
                title={el.name}
                setSelected={setSelectedLang}
                setOpened={setOpened}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

const Item = ({ code, title, setSelected, setOpened }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      action={() => {
        setSelected(title);
        setOpened(false);
        startTransition(() => {
          router.replace(`/${code}`);
        });
      }}
      style="ui"
      className="hover:bg-bglight/40"
    >
      {title}
    </Button>
  );
};
