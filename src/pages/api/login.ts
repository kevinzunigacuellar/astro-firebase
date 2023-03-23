import type { APIRoute } from "astro";
import { userAndPasswordSchema } from "../../lib/schemas";

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const result = userAndPasswordSchema.safeParse(formData);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }

  return redirect("/dashboard", 301);
};
