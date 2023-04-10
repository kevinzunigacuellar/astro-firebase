import type { APIRoute } from "astro";
import { auth } from "@lib/firebase/server";

export const get: APIRoute = async ({ redirect, request, cookies }) => {
  /* Get the ID token from header */
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response(
      JSON.stringify({
        error: "No token found",
      }),
      { status: 401 }
    );
  }

  let sessionCookie;
  try {
    /* Verify the ID token */
    await auth.verifyIdToken(idToken);
    const fiveDays = 60 * 60 * 24 * 5 * 1000;
    sessionCookie = await auth
      .createSessionCookie(idToken, { expiresIn: fiveDays })
      .catch((error) => {
        return new Response(
          JSON.stringify({
            message: error.message,
          }),
          { status: 401 }
        );
      });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "The server is on fire",
      }),
      { status: 401 }
    );
  }

  cookies.set("session", sessionCookie, {
    path: "/",
  });

  return redirect("/dashboard", 302);
};
