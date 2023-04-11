export default function SignoutButton() {
  async function signout() {
    const res = await fetch("/api/auth/logout");
    if (!res.ok) {
      const data = await res.json();
      return data;
    }
    if (res.redirected) {
      window.location.assign(res.url);
    }
  }

  return (
    <button
      class="border border-0.5 border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-500 hover:text-zinc-700 hover:border-zinc-600 font-normal dark:hover:text-zinc-100 dark:hover:border-zinc-100 transition-all px-4 py-1 rounded-md"
      type="button"
      onClick={signout}
    >
      Sign out
    </button>
  );
}
