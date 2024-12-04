"use client";

import { ThemeProvider } from "next-themes";
import { Provider, useDispatch } from "react-redux";
import {} from "next/font/local";
import { store } from "@/redux/store";
import Button from "@/components/Button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { user } from "@/public/data";
import { signIn, signOut } from "@/redux/slices/isSigned-slice";
import { useRouter } from "next/navigation";
import Signin from "@/sections/Signin";

/* const roboto = Roboto({ subsets: ["latin"], weight: "400" });
 */
export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" attribute="class">
        <Container>{children}</Container>
      </ThemeProvider>
    </Provider>
  );
}

const Container = ({ children }) => {
  const isSigned = useSelector(
    (state: { isSigned: boolean }) => state.isSigned
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = localStorage.getItem("auth");
  useEffect(() => {
    if (auth === "true") {
      dispatch(signIn());
    } else {
      dispatch(signOut());
    }
  }, []);

  return (
    <div className="text-dark dark:text-light bg-bglight dark:bg-dark transition-colors">
      {isSigned ? children : <Signin />}
    </div>
  );
};
