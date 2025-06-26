"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CheckRolePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchRole = async () => {
      const clerkUserId = user.id;

      const res = await fetch(
        `http://localhost:8080/api/users/check-role?clerkUserId=${clerkUserId}`
      );

      const data = await res.json();

      if (!data.hasRole) {
        router.push("/choose-role");
      } else {
        router.push(`/dashboard/${data.roles[0]}`);
      }
    };

    fetchRole();
  }, [isLoaded, isSignedIn, user]);

  return <p>Checking your role...</p>;
}
