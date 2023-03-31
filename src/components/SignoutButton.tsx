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
      class="border border-0.5 border-zinc-700 text-zinc-500 font-normal hover:text-zinc-100 hover:border-zinc-100 transition-all px-4 py-1 rounded-md"
      type="button"
      onClick={signout}
    >
      Sign out
    </button>
  );
}
