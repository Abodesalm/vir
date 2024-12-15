"use client";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { NextIntlClientProvider, useMessages } from "next-intl";

export default function Providers({ children, locale, messages }) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider defaultTheme="system" attribute="class">
          <Container>{children}</Container>
        </ThemeProvider>
      </NextIntlClientProvider>
    </Provider>
  );
}

const Container = ({ children }) => {
  return (
    <div className="text-dark dark:text-light bg-bglight dark:bg-dark transition-colors">
      {children}
    </div>
  );
};
