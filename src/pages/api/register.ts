import firebaseApp from '../../lib/firebase';
import type { APIRoute } from 'astro';
import { userAndPasswordSchema } from '../../lib/schemas';

export const post: APIRoute = async ({ request, redirect, cookies }) => {
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
 
  const user = await firebaseApp.auth().createUser({
    email,
    password,
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        errors: 'Something went wrong',
      }),
      { status: 400 }
    );
  }

  // create a custom token for the new user
  const idToken = await firebaseApp.auth().createCustomToken(user.uid);
  const oneWeek = 60 * 60 * 24 * 7 * 1000;

  // create a new cookie in Firebase
  const cookie = await firebaseApp.auth().createSessionCookie(idToken, {
    expiresIn: oneWeek,
  });

  // set the session cookie in the response
  cookies.set('session', cookie)
  console.log('Redirecting to dashboard ...')
  return redirect('/dashboard', 301);

}