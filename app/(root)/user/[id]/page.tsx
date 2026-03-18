import { auth } from "@/auth";
import { StartupCardSkeleton } from "@/components/StartUpCard";
import UserStartup from "@/components/UserStartup";
import { AUTHOR_BY_ID_QUERY } from "@/lib/queries";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();
  return (
    <>
      <section className="profile-container">
        <div className="profile-card">
          <div className="profile-title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile-image"
          />
          <p className="text-30-extrabold">@{user?.username}</p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:mt-5">
            <p className="text-30-semibold">
                {session?.id === id ? 'Your' : 'All' } Startups
            </p>

            <ul className="card-grid-sm">
                <Suspense fallback={<StartupCardSkeleton/>}>

                <UserStartup id={id}/>
                </Suspense>

            </ul>
        </div>
      </section>
    </>
  );
};

export default page;
