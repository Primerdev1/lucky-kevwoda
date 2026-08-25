import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionIndex } from "@/components/CollectionIndex";
import { collectionCopy, collections, getPosts, isCollection } from "@/lib/posts";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return collections.map((collection) => ({ collection }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  if (!isCollection(collection)) return {};
  const copy = collectionCopy[collection];
  return {
    title: copy.title,
    description: copy.deck,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isCollection(collection)) notFound();
  const posts = await getPosts(collection);
  return <CollectionIndex collection={collection} posts={posts} />;
}
