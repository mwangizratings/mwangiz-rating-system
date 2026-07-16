type ServerEnv = {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  ipHashSecret: string;
};

type PublicSupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const DEFAULT_PUBLIC_SITE_URL = "https://rate-mwangiz.vercel.app";

function readRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function getServerEnv(): ServerEnv {
  return {
    supabaseUrl: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseServiceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    ipHashSecret: readRequiredEnv("IP_HASH_SECRET"),
  };
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export function getPublicSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/g, "") ??
    DEFAULT_PUBLIC_SITE_URL
  );
}
