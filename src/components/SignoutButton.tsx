export default function SignoutButton() {
  async function signout() {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    if (response.redirected) {
      window.location.assign(response.url);
    }
  }

  return (
    <button
      class="bg-indigo-400 font-medium hover:bg-indigo-400 px-4 py-1 rounded-md"
      type="button"
      onClick={signout}
    >
      Sign out
    </button>
  );
}
