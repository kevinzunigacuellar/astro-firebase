import type { APIRoute } from "astro";
import firebase from "../../lib/firebase/server";

export const post: APIRoute = async ({ redirect, request, cookies }) => {
  /* Get the ID token */
  const { idToken } = await request.json().catch((error) => {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      { status: 401 }
    );
  });

  /* Verify the ID token */
  await firebase.auth().verifyIdToken(idToken).catch((error) => {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      { status: 401 }
    );
  })

  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await firebase
    .auth()
    .createSessionCookie(idToken, { expiresIn: fiveDays }).catch((error) => {
      return new Response(
        JSON.stringify({
          message: error.message,
        }),
        { status: 401 }
      );
    });

  cookies.set("session", sessionCookie, {
    path: "/",
  });

  return redirect("/dashboard", 302);
};
