import type { APIRoute } from "astro";
import firebase from "../../lib/firebase/server";

export const post: APIRoute = async ({ redirect, request, cookies }) => {
  const { idToken } = await request.json();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await firebase
    .auth()
    .createSessionCookie(idToken, { expiresIn });
  cookies.set("session", sessionCookie, {
    path: "/",
  });
  return redirect("/dashboard", 302);
};
