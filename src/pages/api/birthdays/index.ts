import type { APIRoute } from "astro";
import { firestore, auth } from "@lib/firebase/server";
import { createBirthdaySchema } from "@lib/schemas";

export const post: APIRoute = async ({ request, cookies, redirect }) => {
  /* Get cookie from header */
  const sessionCookie = cookies.get("session").value;
  if (!sessionCookie) {
    return new Response(
      JSON.stringify({
        error: "No token found",
      }),
      { status: 401 }
    );
  }
  /* Verify cookie */
  const { uid } = await auth.verifySessionCookie(sessionCookie, true);
  const formData = await request.formData();
  const result = createBirthdaySchema.safeParse(formData);

  /* Validate the data */
  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }
  const { name, day, month, affiliation, year } = result.data;

  /* Create the record */
  try {
    await firestore.collection("birthdays").add({
      name,
      date: {
        day,
        month,
        year: year ?? 0,
      },
      affiliation: affiliation ? affiliation.toLowerCase() : "",
      authorId: uid,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
      }),
      { status: 500 }
    );
  }

  return redirect("/dashboard");
};
