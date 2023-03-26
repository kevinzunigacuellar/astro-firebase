import ServerfirebaseApp from "../../lib/firebase/server";
import type { APIRoute } from "astro";
import { registerSchema } from "../../lib/schemas";

export const post: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();
  const result = registerSchema.safeParse(formData);

  // If the form data is invalid, return an error response
  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }

  // create a new user in Firebase
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
