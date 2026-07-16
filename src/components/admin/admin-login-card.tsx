"use client";

import { motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminLoginCardProps = {
  accessDenied?: boolean;
};

export function AdminLoginCard({ accessDenied = false }: AdminLoginCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(
    accessDenied
      ? "Access denied. Please use an email that is approved for this admin portal."
      : null,
  );
  const [isSending, setIsSending] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminSession() {
      const supabase = createSupabaseBrowserClient();
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      if (tokenHash && type === "magiclink") {
        await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "magiclink",
        });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user?.email) {
        setIsCheckingSession(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_whitelist")
        .select("id")
        .ilike("email", user.email)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error || !data) {
        await supabase.auth.signOut();
        setIsSuccess(false);
        setMessage(
          "Access denied. Please use an email that is approved for this admin portal.",
        );
        setIsCheckingSession(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    }

    verifyAdminSession().catch(() => {
      if (!isMounted) {
        return;
      }

      setIsCheckingSession(false);
      setMessage("We could not complete sign in. Please request a new link.");
    });

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    setIsSending(false);

    if (error) {
      setIsSuccess(false);
      setMessage("We could not send the magic link. Please try again.");
      return;
    }

    setIsSuccess(true);
    setMessage("Magic link sent. Please check your email to continue.");
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <section className="rounded-[2rem] border border-white/80 bg-white/90 px-6 py-8 text-center shadow-[0_24px_80px_rgba(61,28,82,0.14)] backdrop-blur sm:px-8">
        <div className="mx-auto mb-6 grid size-18 place-items-center rounded-[1.75rem] border border-[#e8d7a3] bg-[#fff8e8]">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#6d3a8f] text-xl font-bold text-[#ffd875]">
            M
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a47b17]">
            Mwangiz Beauty Parlor
          </p>
          <h1 className="text-3xl font-semibold text-[#2b1836]">
            Admin Portal
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-6 text-[#6f6077]">
            Sign in with your approved admin email to view customer feedback and
            analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4 text-left">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[#33203d]">
              Email address
            </span>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@mwangizbeauty.com"
              autoComplete="email"
            />
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={isSending || isCheckingSession}
            className="min-h-13 w-full bg-[#6d3a8f] text-white hover:bg-[#5d2f7d]"
          >
            {isCheckingSession ? (
              "Checking session"
            ) : isSending ? (
              "Sending Magic Link"
            ) : (
              <>
                <Mail aria-hidden="true" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>

        {message ? (
          <div
            role={isSuccess ? "status" : "alert"}
            className="mt-5 flex items-start gap-3 rounded-3xl border border-[#ead9f0] bg-[#fbf7fc] px-4 py-3 text-left text-sm leading-6 text-[#59425f]"
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#6d3a8f]" />
            <span>{message}</span>
          </div>
        ) : null}
      </section>
    </motion.main>
  );
}
