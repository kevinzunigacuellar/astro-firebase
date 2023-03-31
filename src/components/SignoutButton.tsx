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
      class="border font-medium text-zinc-200 hover:text-zinc-900 hover:bg-zinc-100 transition-all px-4 py-1 rounded-md"
      type="button"
      onClick={signout}
    >
      Sign out
    </button>
  );
}
