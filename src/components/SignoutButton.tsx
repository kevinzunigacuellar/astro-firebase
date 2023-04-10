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
      class="border border-0.5 border-zinc-700 text-zinc-500 font-normal hover:text-zinc-100 hover:border-zinc-100 transition-all px-4 py-1 rounded-md"
      type="button"
      onClick={signout}
    >
      Sign out
    </button>
  );
}
