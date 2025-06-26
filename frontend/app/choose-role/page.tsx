"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChooseRolePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const checkRole = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/check-role?clerkUserId=${user.id}`
        );

        const data = await res.json();

        if (data.hasRole) {
          // 🚫 If role exists, redirect to appropriate dashboard
          router.push(`/dashboard/${data.roles[0]}`);
        } else {
          setLoading(false); // ✅ Show role selection UI
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    checkRole();
  }, [isLoaded, isSignedIn, user, router]);

  if (loading) return <p className="text-center mt-10">Checking role...</p>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Choose your Role</h1>
      <p className="mb-4">Are you here to buy or sell?</p>

      {/* Simple Buttons — We'll wire them to backend next */}
      <button
        onClick={() => handleConfirmRole("buyer")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4"
      >
        Buyer
      </button>

      <button 
        onClick={() => handleConfirmRole("seller")}
        className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer"
      >
        Seller
      </button>
    </div>
  );

  async function handleConfirmRole(role: "buyer" | "seller") {
    try {
      const res = await fetch("http://localhost:8080/api/users/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user?.id,
          role,
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/${role}`);
      } else {
        const error = await res.json();
        console.error("Error assigning role:", error);
        alert("Failed to assign role.");
      }
    } catch (err) {
      console.error("Failed to assign role:", err);
    }
  }
}
