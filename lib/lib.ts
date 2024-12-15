import { SessionOptions } from "iron-session";

export interface SessionData {
  email?: string;
  isLoged: boolean;
  expiresAt?: number;
}

export const defaultSession: SessionData = {
  isLoged: false,
};

export const sessionOptions: SessionOptions = {
  password: "iawyfa7821931gff1h87gef187eh8wsd1wushksjf1ij1is9",
  cookieName: "virgo-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};
