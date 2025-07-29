"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
function Dashboard() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (name.length === 0 && password.length === 0) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [name, password]);
  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (name.length === 0 && password.length === 0) {
        console.error(
          "please enter required fields, either name or password whichever you want to change"
        );
      }
      await axios.post("/api/auth/editusersettings", {
        email: session!.user.email,
        name,
        password,
      });

      toast.success("User details updated successfully!");
      if (process.env.NODE_ENV !== "production") {
        console.log("User details updated successfully.");
      }

      signOut();
      router.push("/login");
    } catch (error) {
      toast.error("Failed to update user details. Please try again.");
      console.error("error changing details: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Update your account details for {session?.user.email}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground block mb-2"
              >
                Display Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your display name"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground block mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter new password (optional)"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">
                💡 <strong>Note:</strong> You can update either your name,
                password, or both. Changing your password will require you to
                log in again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/notes")}
                className="flex-1 px-6 py-3 rounded-xl border border-input bg-background text-foreground hover:bg-accent transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isDisabled}
                className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                }`}
              >
                Update Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
