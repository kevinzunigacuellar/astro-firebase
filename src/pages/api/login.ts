import type { APIRoute } from "astro";
import firebase from "../../lib/firebase/server";

export const post: APIRoute = async ({ redirect, request, cookies }) => {
  /* Get the ID token */
  /* Verify the ID token */
  let sessionCookie;
  try {
    const { idToken } = await request.json();
    await firebase.auth().verifyIdToken(idToken);
    const fiveDays = 60 * 60 * 24 * 5 * 1000;
    sessionCookie = await firebase
      .auth()
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
