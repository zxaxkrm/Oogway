import SearchForm from "../../components/SearchForm";
import StartUpCard from "@/components/StartUpCard";
import { STARTUP_QUERY } from "@/lib/queries";
import { StartUpTypeCard } from "@/components/StartUpCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const params = {search: query || null};

  

  const {data: posts} = await sanityFetch({query: STARTUP_QUERY, params})

  return (
    <>
      <section className="pink-container">
        <h1 className="heading-hero font-work-sans">
          Pitch your startup, <br /> Connect and grow
        </h1>

        <p className="sub-heading max-w-3xl! font-work-sans">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section-container font-work-sans">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All startups"}
        </p>

        <ul className="mt-7 card-grid">
          {posts?.length > 0 ? (
            posts.map((post: StartUpTypeCard) => (
              <StartUpCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-result">No startup found</p>
          )}
        </ul>
      </section>

      <SanityLive/>
    </>
  );
}
