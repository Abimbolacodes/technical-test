

"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";



export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
      router.push("/login");
  }, [router]);

    return (
      <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting to login...</div>
      </div>
    );
}