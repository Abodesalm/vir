"use client";
import { login } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Signin() {
  const { dispatch, state } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("signin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await login({ email, password });

    if (response.error) {
      dispatch({ type: "LOGIN_FAILURE", payload: response.error });
    } else if (response.data) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.access_token,
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={`flex justify-center items-center h-[70vh] w-full`}>
      <form className="form bg-light dark:bg-middark" onSubmit={handleSubmit}>
        <p className="capitalize text-size-3">{t("title")}</p>
        <input
          type="email"
          placeholder={t("email")}
          name="email"
          autoComplete="email"
          className="input"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("password")}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="input"
          required
        />
        <button className="btn-prime mt-4" disabled={isLoading} type="submit">
          {isLoading ? t("button_loading") : t("button")}
        </button>
        {state.error && <span className="text-danger">{state.error}</span>}
      </form>
    </div>
  );
}
