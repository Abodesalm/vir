"use client";

import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n } from "@/i18n.config";

const langs = [
  { name: "English", code: "en" },
  { name: "Arabic", code: "ar" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
];

export default function Langlist() {
  const [selectedLang, setSelectedLang] = useState("English");
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

const Item = ({ key, title, setSelected, setOpened }) => {
  const pathName = usePathname();

  const redirectedPath = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    console.log(segments[1]);
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <Button
      action={() => {
        setSelected(title);
        setOpened(false);
      }}
      style="ui"
      className="hover:bg-bglight/40"
    >
      <Link href={redirectedPath(key)} className="w-full h-full">
        {title}
      </Link>
    </Button>
  );
};
