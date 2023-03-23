import type { APIRoute } from "astro";
import { loginSchema } from "../../lib/schemas";

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }

  console.log(result.data);

  return new Response(JSON.stringify({ error: "Password is incorrect" }));
};
