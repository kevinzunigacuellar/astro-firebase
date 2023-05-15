import type { APIRoute } from "astro";
import { auth, firestore } from "@lib/firebase/server";
import { updateBirthdaySchema } from "@lib/schemas";
import type { BirthdayTypeWithId } from "@lib/types";

export const put: APIRoute = async ({ request, cookies, redirect, params }) => {
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
  const result = updateBirthdaySchema.safeParse(formData);

  /* Validate the form data */
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
        error: "Unauthorized, you are not the author of this record",
      }),
      { status: 401 }
    );
  }

  /* Get the record id */
  const documentId = params.id;
  if (!documentId) {
    return new Response(
      JSON.stringify({
        error: "A put request must have a document ID",
      }),
      { status: 400 }
    );
  }
  
  /* Validate if the record exists */
  const record = await firestore.collection("birthdays").doc(documentId).get();
  if (!record.exists) {
    return new Response(
      JSON.stringify({
        error: "Record not found",
      }),
      { status: 404 }
    );
  }

  /* Update record */
  try {
    await firestore
    .collection("birthdays")
    .doc(documentId)
    .update({
      name,
      date: {
        day,
        month,
        year: year ?? 0,
      },
      affiliation: affiliation ? affiliation.toLowerCase() : "",
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Something went wrong"
      }),
    )
  }
  return redirect("/dashboard", 302);
};

export const del: APIRoute = async ({ cookies, redirect, params }) => {
  /* Get user id from cookie */
  const sessionCookie = cookies.get("session").value;
  if (!sessionCookie) {
    return new Response(
      JSON.stringify({
        error: "No token found",
      }),
      { status: 401 }
    );
  }
  const { uid } = await auth.verifySessionCookie(sessionCookie, true);

  /* Get the record id */
  const documentId = params.id;
  if (!documentId) {
    return new Response(
      JSON.stringify({
        error: "Delete request must have a document ID",
      }),
      { status: 400 }
    );
  }
  /* Validate if the record exists */
  const record = await firestore.collection("birthdays").doc(documentId).get();
  if (!record.exists) {
    return new Response(
      JSON.stringify({
        error: "Record not found",
      }),
      { status: 404 }
    );
  }

  /* Validate if the user is the author */
  const { authorId } = record.data() as BirthdayTypeWithId;
  if (uid !== authorId) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized, you are not the author of this record",
      }),
      { status: 401 }
    );
  }

  /* Delete the record */
  try {
    await firestore.collection("birthdays").doc(documentId).delete();
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
      }),
      { status: 500 }
    );
  }
  return redirect("/dashboard", 302);
};
