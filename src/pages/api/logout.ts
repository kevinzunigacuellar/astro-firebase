import type { APIRoute } from "astro";

export const post: APIRoute = async ({ redirect, request, cookies }) => {
  cookies.delete("session");
  return redirect("/login", 302);
};
