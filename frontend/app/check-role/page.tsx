"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckRolePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const res = await fetch(
          "https://<YOUR_NGROK_BACKEND_URL>/api/users/check-role?clerkUserId=" + user.id
        );
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to check role");
        
        if (data.hasRole) {
          if (data.hasRole) {
        if (data.role === "buyer") {
            router.replace("/dashboard/buyer");
  } 
  else if (data.role === "seller") {
            router.replace("/dashboard/seller");
  }
}
        } else {
          router.replace("/choose-role");
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    checkRole();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="flex items-center justify-center h-screen text-xl font-semibold">
      Checking your access...
    </div>
  );
}
