// app/oauth/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "No token received",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [searchParams, router, toast]);

  return <p className="text-center mt-20">Processing login...</p>;
}
