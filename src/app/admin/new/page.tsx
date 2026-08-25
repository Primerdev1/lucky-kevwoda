import { AdminBar } from "@/components/admin/AdminBar";
import { PostForm } from "@/components/admin/PostForm";

export default function AdminNewPostPage() {
  return (
    <>
      <AdminBar />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#e06a36]">
          Compose
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-[-0.04em]">New post</h1>
        <PostForm mode="create" />
      </div>
    </>
  );
}
