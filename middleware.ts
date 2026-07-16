import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/supabase/types";

const ADMIN_LOGIN_PATH = "/admin/login";

function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse,
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase public environment variables");
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

function redirectToLogin(request: NextRequest, denied = false) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = ADMIN_LOGIN_PATH;
  redirectUrl.search = denied ? "?denied=1" : "";

  return NextResponse.redirect(redirectUrl);
}

async function isWhitelistedAdmin(
  supabase: ReturnType<typeof createMiddlewareSupabaseClient>,
  email: string,
) {
  const { data, error } = await supabase
    .from("admin_whitelist")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  return !error && Boolean(data);
}

function redirectWithSessionCookies(
  redirectResponse: NextResponse,
  sessionResponse: NextResponse,
) {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createMiddlewareSupabaseClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === ADMIN_LOGIN_PATH) {
    if (!user?.email) {
      return response;
    }

    const isAllowed = await isWhitelistedAdmin(supabase, user.email);

    if (!isAllowed) {
      await supabase.auth.signOut();
      return redirectWithSessionCookies(redirectToLogin(request, true), response);
    }

    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    adminUrl.search = "";

    return NextResponse.redirect(adminUrl);
  }

  if (!user?.email) {
    return redirectToLogin(request);
  }

  const isAllowed = await isWhitelistedAdmin(supabase, user.email);

  if (!isAllowed) {
    await supabase.auth.signOut();
    return redirectWithSessionCookies(redirectToLogin(request, true), response);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
