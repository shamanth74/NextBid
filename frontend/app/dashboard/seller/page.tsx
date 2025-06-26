"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const checkAccess = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/check-role?clerkUserId=${user.id}`
        );

        const data = await res.json();

        if (!data.roles.includes("seller")) {
          // 🚫 Not a buyer → redirect to home or error page
          router.push("/unauthorized");
        } else {
          setLoading(false); //  Allowed to stay
        }
      } catch (err) {
        console.error("Error verifying role:", err);
        router.push("/unauthorized");
      }
    };

    checkAccess();
  }, [isLoaded, isSignedIn, user, router]);

  if (loading) return <p className="text-center mt-10">Verifying access...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome Seller 👋</h1>
      <p>This {user?.firstName} is your dashboard where you can view all your listings.</p>
    </div>
  );
}
