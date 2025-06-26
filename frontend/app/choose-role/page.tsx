"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChooseRolePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAssignRole = async () => {
    if (!user || !selectedRole) return;

    setLoading(true);

    try {
      const res = await fetch("https://<YOUR_BACKEND_URL>/api/users/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId: user.id,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to assign role");

      if (selectedRole === "buyer") {
        router.push("/dashboard/buyer");
    } 
    else if (selectedRole === "seller") {
        router.push("/dashboard/seller");
}
    } catch (err) {
      console.error("Error assigning role:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Select Your Role</h1>

      <div className="space-y-4 mb-6">
        <label className="block">
          <input
            type="radio"
            name="role"
            value="buyer"
            checked={selectedRole === "buyer"}
            onChange={() => setSelectedRole("buyer")}
            className="mr-2"
          />
          Buyer
        </label>

        <label className="block">
          <input
            type="radio"
            name="role"
            value="seller"
            checked={selectedRole === "seller"}
            onChange={() => setSelectedRole("seller")}
            className="mr-2"
          />
          Seller
        </label>
      </div>

      <button
        onClick={handleAssignRole}
        disabled={!selectedRole || loading}
        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        {loading ? "Saving..." : "Confirm Role"}
      </button>
    </div>
  );
}
