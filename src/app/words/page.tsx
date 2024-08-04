import { posts } from "#site/content"

export default async function WordsPage() {

    const displayPosts = posts

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
        </div>
    )
}