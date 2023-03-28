import type { APIRoute } from "astro";

export const post: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete("session", {
    path: "/",
  });
  return redirect("/login", 302);
};
