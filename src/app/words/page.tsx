import { posts } from "#site/content";
import { PostItem } from "@/components/post-item";
import { sortPosts } from "@/lib/utils";

export default async function WordsPage() {
  const displayPosts = sortPosts(posts.filter((post) => post.published));

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      {/* was `item-start` — not a Tailwind class, so it silently did nothing */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          {/* was `lg:tex-5xl` — a typo, which is why this never scaled up on desktop */}
          <h1 className="inline-block font-black italic text-4xl lg:text-5xl">
            Words
          </h1>
          <p className="text-xl text-muted-foreground font-bold">
            A repository of thoughts.
          </p>
        </div>
      </div>
      <hr className="mt-8" />
      {displayPosts.length > 0 ? (
        <ul className="flex flex-col">
          {displayPosts.map((post) => {
            const { slug, date, title, description } = post;
            return (
              <li key={slug}>
                <PostItem
                  slug={slug}
                  date={date}
                  title={title}
                  description={description}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Nothing to see here yet</p>
      )}
    </div>
  );
}
