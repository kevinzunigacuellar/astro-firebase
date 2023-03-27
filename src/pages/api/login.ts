import type { APIRoute } from "astro";
import firebase from "../../lib/firebase/server";

export const post: APIRoute = async ({ redirect, request, cookies }) => {
  let sessionCookie;
  try {
    /* Get the ID token */
    const { idToken } = await request.json();
    
    /* Verify the ID token */
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
