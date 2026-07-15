type ServerEnv = {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  ipHashSecret: string;
};

type PublicSupabaseEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

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
  return {
    supabaseUrl: readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}
