import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from 'markdown-it'
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartUpCard, { StartUpTypeCard } from "@/components/StartUpCard";

const StartUpContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const [post,{select: editorPosts} ] = await Promise.all([
     client.fetch(STARTUP_BY_ID_QUERY, { id }),
     client.fetch(PLAYLIST_BY_SLUG_QUERY,{slug: 'editor-picks'}) 
  ])

  if (!post) return notFound();
    const md = markdownit();
  const parsedContent = md.render(post?.pitch || ' ');

  return (
    <>
      <section className="pink-container min-h-57.5 bg-[#f02b69]">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading-hero">{post.title}</h1>
        <p className="sub-heading">{post.description}</p>
      </section>

      <section className="section-container ">
        <img src={post.image} alt="impost" className="h-auto rounded-xl" />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex justify-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="authorimage"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium ">{post.author.name}</p>
                <p className="text-16-medium text-black-300!">@{post.author.username}</p>
              </div>
            </Link>
           <p className="category-tag">{post.category}</p>
          </div>

            <h3 className="text-30-bold">Pitch Details</h3>
            {parsedContent ? (
              <article dangerouslySetInnerHTML={{__html: parsedContent}} className="prose  font-work-sans max-w-4xl break-all"/>
            ):(
              <p className="no-result">No Details Provided</p>
            )}

        </div>

        <hr className="divider"/>

            {editorPosts?.length > 0 && (
              <div className="max-w-4xl mx-auto ">
                  <p className="text-30-semibold">Editor Picks</p>

                  <ul className="mt-7 card-grid-sm">
                    {editorPosts.map((post: StartUpTypeCard, index: number)=> 
                    <StartUpCard key={index} post={post} />
                    )}
                  </ul>
              </div>
            )}


        <Suspense fallback={<Skeleton className="view-skeleton"/>}>
            <View id={id}/>
        </Suspense>

      </section>
    </>
  );
};

const StartUpDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartUpContent params={params} />
    </Suspense>
  );
};

export default StartUpDetails;
