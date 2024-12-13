"use client";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

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
  return (
    <div className="text-dark dark:text-light bg-bglight dark:bg-dark transition-colors">
      {children}
    </div>
  );
};
