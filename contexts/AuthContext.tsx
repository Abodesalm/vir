"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, User } from "@/types/auth";
import {
  getStoredAuth,
  isTokenExpired,
  refreshToken,
  logout,
} from "../services/auth";

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REFRESH_TOKEN"; payload: string };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "REFRESH_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user } = getStoredAuth();

        if (token && user) {
          if (isTokenExpired()) {
            const success = await refreshToken();
            if (!success) {
              logout();
              dispatch({ type: "LOGOUT" });
            } else {
              const { token: newToken } = getStoredAuth();
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: { user, token: newToken! },
              });
            }
          } else {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, token },
            });
          }
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        logout();
        dispatch({ type: "LOGOUT" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!state.isAuthenticated) return;

    const checkToken = async () => {
      if (isTokenExpired()) {
        const success = await refreshToken();
        if (!success) {
          logout();
          dispatch({ type: "LOGOUT" });
        } else {
          const { token } = getStoredAuth();
          if (token) {
            dispatch({ type: "REFRESH_TOKEN", payload: token });
          }
        }
      }
    };

    const interval = setInterval(checkToken, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
