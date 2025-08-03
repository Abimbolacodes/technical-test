


// src/service/auth.service.ts
import { signIn } from "next-auth/react";

export const loginWithEmail = async (email: string) => {
  const result = await signIn("credentials", {
    email,
    redirect: false,
  });
  
  return result;
};