import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req) {
    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // CHECK USER SESSION
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // IF NOT LOGGED IN
  if (!session) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return response;
}

// PROTECT ADMIN ROUTES
export const config = {
  matcher: ["/admin/:path*"],
};