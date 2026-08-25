import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/PostArticle";
import { getPost, getPosts, isCollection } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ collection: post.collection, slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}): Promise<Metadata> {
  const { collection, slug } = await params;
  if (!isCollection(collection)) return {};
  const post = await getPost(collection, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.legalName],
    },
  };
}

export default async function CollectionPostPage({
  params,
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) notFound();
  const post = await getPost(collection, slug);
  if (!post) notFound();
  const related = (await getPosts(collection)).filter((item) => item.slug !== post.slug).slice(0, 3);
  return <PostArticle post={post} related={related} />;
}
