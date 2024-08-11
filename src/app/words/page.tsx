import { posts } from "#site/content"
import { PostItem } from "@/components/post-item";
import { sortPosts } from "@/lib/utils";

export default async function WordsPage() {
    const sortedPosts = sortPosts(posts.filter((posts) => posts.published));
    const displayPosts = sortedPosts
    console.log(posts);

    return (
        <div className="container max-w-4xl py-6 lg:py-10">
            <div className="flex flex-col item-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-black italic text-4xl lg:tex-5xl">Words</h1>
                <p className="text-xl text-muted-foreground">
                    Getting out of my head, and getting it online.
                </p>
                </div>
            </div>
            <hr className="mt-8" />
            {displayPosts?.length > 0 ? (
             <ul className="flex flex-col">
                {displayPosts.map(posts => {
                    const { slug, date, title, description } = posts;
                    return (
                        <li key={slug}>
                            <PostItem slug={slug} date={date} title={title} description={description} />
                        </li>
                    )
                })}
             </ul>
            ) : (
                <p>Nothing to see here yet</p>
            )}
        </div>
    );
}
