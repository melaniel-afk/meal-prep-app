import { signIn, signUp } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm bg-[#FFFDFB] rounded-3xl shadow-lg p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-script mb-3">
            M
          </div>
          <h1 className="font-script text-4xl text-accent font-bold">Meal Prep</h1>
          <p className="font-serif italic text-sm text-[#6E6579] mt-1">Your life, organized.</p>
        </div>

        {error && (
          <div className="mb-5 text-sm text-[#96652C] bg-[#F5E9D6] rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8A8195] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full min-h-11 rounded-xl border border-[#E6DBF2] px-4 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8A8195] mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full min-h-11 rounded-xl border border-[#E6DBF2] px-4 text-sm"
            />
          </div>

          <button
            formAction={signIn}
            className="min-h-11 rounded-full bg-accent text-white text-sm font-semibold mt-2"
          >
            Sign In
          </button>
          <button
            formAction={signUp}
            className="min-h-11 rounded-full text-accent text-sm font-semibold border border-[#D8C6EC]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
