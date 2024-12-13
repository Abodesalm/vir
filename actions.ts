"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const email = "ui@virgo.com";
const password = "aaa";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );
  if (!session.isLoged) {
    session.isLoged = defaultSession.isLoged;
  }
  return session;
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();
  const formEmail = formData.get("email") as string;
  const formPassword = formData.get("password") as string;

  if (formEmail !== email || formPassword !== password) {
    return { error: "Wrong Crediantials!" };
  }
  session.email = formEmail;
  session.password = formPassword;
  session.isLoged = true;

  await session.save();
  redirect("/");
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
};
