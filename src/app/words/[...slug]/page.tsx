import { posts } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatTimestamp } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface PostPageProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const slug = params?.slug?.join("/");
  return posts.find((post) => post.slugAsParams === slug);
}

export async function generateStaticParams(): Promise<
  PostPageProps["params"][]
> {
  return posts.map((post) => ({ slug: post.slugAsParams.split("/") }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="container py-6 prose dark:prose-invert max-w-3xl mx-auto">
      <h1 className="mb-2">{post.title}</h1>
      {post.description ? (
        <p className="text-xl mt-0 text-muted-foreground">{post.description}</p>
      ) : null}
      {post.lastEdited && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {/* A real git timestamp, not a frontmatter calendar date — so it uses
              formatTimestamp, which pins to your zone rather than UTC. */}
          <span>
            Last edited:{" "}
            <time dateTime={post.lastEdited}>
              {formatTimestamp(post.lastEdited)}
            </time>
          </span>
        </div>
      )}
      <hr className="my-4" />
      <MDXContent code={post.body} />
      <Link
        href="./"
        className={cn(buttonVariants({ variant: "link" }), "py-0")}
      >
        ← Go Back
      </Link>
    </article>
  );
}
