import { defineConfig, defineCollection, s } from 'velite'
import { getLastCommitDate } from './src/lib/git-utils'

const computedFields = <T extends { slug: string }>(data: T) => ({
    ...data,
    slugAsParams: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
    name: "Post",
    pattern: "words/**/*.mdx",
    schema: s
    .object({
        slug: s.path(),
        title: s.string().max(99),
        description: s.string().max(999).optional(),
        date: s.isodate(),
        published: s.boolean().default(true),
        body: s.mdx(),
    })
    .transform((data, { meta }) => {
        // meta.path contains the absolute path to the file
        const filePath = meta.path as string;

        // Get last commit date from git
        const lastEdited = getLastCommitDate(filePath);

        return {
            ...computedFields(data),
            lastEdited,
        };
    }),
});

export default defineConfig({
    root: "content",
    output: {
        data: ".velite",
        assets: "public/static",
        base: "/static/",
        name: "[name]-[hash:6].[ext]",
        clean: true,
    },
    collections: { posts },
    mdx: {
        rehypePlugins: [],
        remarkPlugins: [],
    }
});
