import { type GrayMatterFileWithPath } from "./markdown";
import type { Post } from "./types";

let getPosts: (slug?: string) => Promise<Post[]> = async () => [];

if (process.server) {
  const { getMarkdownFrontMatter } = await import("./markdown");
  const path = await import("path");

  const parsePost = (post: GrayMatterFileWithPath): Post => {
    return {
      slug: path.parse(post.path).name,
      title: post.data.title,
      description: post.data.description,
      keywords: post.data.keywords,
      publishedTime: post.data.publishedTime,
      modifiedTime: post.data.modifiedTime,
      content: post.content,
    };
  };

  const getPostsPath = (slug = "*") => {
    return path.join(process.cwd(), `content/posts/${slug}.mdx`);
  };

  getPosts = async (slug?: string) => {
    const pattern = getPostsPath(slug);
    const projects = (await getMarkdownFrontMatter(pattern))
      .map(parsePost)
      .filter((x) => x.publishedTime)
      .reverse();
    return projects;
  };
}

export { getPosts };
