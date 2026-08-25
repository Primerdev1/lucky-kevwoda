import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[#e06a36]">
        Publishing
      </p>
      <h1 className="mt-3 font-display text-5xl tracking-[-0.04em]">Admin</h1>
      <p className="mt-3 font-serif text-lg text-[#b7ab99]">
        Sign in to write, edit, and publish posts.
      </p>
      <AdminLoginForm nextPath={next || "/admin"} />
    </div>
  );
}
