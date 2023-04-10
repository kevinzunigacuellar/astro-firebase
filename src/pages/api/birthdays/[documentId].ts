import type { APIRoute } from "astro";
import { auth, firestore } from "@lib/firebase/server";
import { updateBirthdaySchema } from "@lib/schemas";

export const put: APIRoute = async ({ request, cookies, redirect, url }) => {
  /* Get the ID token from header */
  const sessionCookie = cookies.get("session").value;
  if (!sessionCookie) {
    return new Response(
      JSON.stringify({
        error: "No token found",
      }),
      { status: 401 }
    );
  }

  /* Verify the ID token */
  const { uid } = await auth.verifySessionCookie(sessionCookie, true);
  const formData = await request.formData();
  const result = updateBirthdaySchema.safeParse(formData);

  /* Validate the data */
  if (!result.success) {
    return new Response(
      JSON.stringify({
        errors: result.error.flatten(),
      }),
      { status: 400 }
    );
  }

  const { name, day, month, affiliation, year, authorId } = result.data;
  if (uid !== authorId) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  /* Update the record */
  const recordId = url.pathname.split("/").pop();
  if (!recordId) {
    return new Response(
      JSON.stringify({
        error: "Put request must have a document ID",
      }),
      { status: 400 }
    );
  }
  await firestore
    .collection("birthdays")
    .doc(recordId)
    .update({
      name,
      date: {
        day,
        month,
        year: year ?? 0,
      },
      affiliation: affiliation ? affiliation.toLowerCase() : "",
    });

  return redirect("/dashboard", 302);
};

export const del: APIRoute = async ({ request, cookies, redirect, url }) => {
  /* Get the ID token from header */
  const sessionCookie = cookies.get("session").value;
  if (!sessionCookie) {
    return new Response(
      JSON.stringify({
        error: "No token found",
      }),
      { status: 401 }
    );
  }

  /* Verify the ID token */
  const { uid } = await auth.verifySessionCookie(sessionCookie, true);

  /* Verify if the user is the author */
  const { authorId } = await request.json();
  if (uid !== authorId) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      { status: 401 }
    );
  }

  /* Delete the record */
  const recordId = url.pathname.split("/").pop();
  if (!recordId) {
    return new Response(
      JSON.stringify({
        error: "Delete request must have a document ID",
      }),
      { status: 400 }
    );
  }

  await firestore.collection("birthdays").doc(recordId).delete();
  return redirect("/dashboard", 302);
};
