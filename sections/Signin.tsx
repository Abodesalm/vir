"use client";
import { login } from "@/actions";
import { useFormState } from "react-dom";

export default function Signin() {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);

  return (
    <div className={`flex justify-center items-center h-[70vh] w-full`}>
      <form className="form bg-light dark:bg-middark" action={formAction}>
        <p className="capitalize text-size-3">hello, sign in...</p>
        <input
          type="email"
          placeholder="email"
          name="email"
          className="input"
          required
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className="input"
          required
        />
        <button className="btn-prime mt-4">
          <>sign in</>
        </button>
        {state?.error && (
          <p className="text-danger text-size-6">{state.error}</p>
        )}
      </form>
    </div>
  );
}
