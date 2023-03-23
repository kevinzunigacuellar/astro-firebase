import firebaseApp from '../../lib/firebase';
import type { APIRoute } from 'astro';
import { userAndPasswordSchema } from '../../lib/schemas';

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const result = userAndPasswordSchema.safeParse(formData);

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
  const { email, password } = result.data;
  let user;
  try {
    user = await firebaseApp.auth().createUser({
      email,
      password,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        errors: 'Something went wrong',
      }),
      { status: 400 }
    );
  }
  console.log("User created:", user);

  // TODO: create a new session in Firebase
  // More steps I have no idea?


  return redirect('/dashboard', 301);

}