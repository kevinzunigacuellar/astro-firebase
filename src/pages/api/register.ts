import ServerfirebaseApp from "../../lib/firebase/server";
import type { APIRoute } from "astro";
import { registerSchema } from "../../lib/schemas";

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const result = registerSchema.safeParse(formData);

  /* Validate the data */
  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }

  /* Create the user */
  const { email, password, name } = result.data;

  try {
    await ServerfirebaseApp.auth().createUser({
      email,
      password,
      displayName: name,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        errors: error.message,
      }),
      { status: 400 }
    );
  }
  return redirect("/login", 302);
};
