import fs from "fs";
import path from "path";
import { cacheDir } from "../../const";
import {
  getMarkdownFrontMatter,
  type GrayMatterFileWithPath,
} from "./markdown";

export type Post = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  publishedTime: string;
  modifiedTime: string;
  content: string;
};

export const parsePost = (post: GrayMatterFileWithPath): Post => {
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

export const getPosts = async (slug?: string) => {
  const pattern = getPostsPath(slug);
  const projects = (await getMarkdownFrontMatter(pattern))
    .map(parsePost)
    .filter((x) => x.publishedTime)
    .reverse();
  return projects;
};

export const getPlaceholderImageCachePath = (path: string) => {
  const normalisedPath = path
    .replace(/(^\/|public\/)/, "")
    .replace(/\//g, "-")
    .replace(/\.(jpg|jpeg|png)$/, ".txt");
  return `${cacheDir}/${normalisedPath}`;
};

export const getPlaceholderImageCache = async (imagePath: string) => {
  const cachePath = getPlaceholderImageCachePath(imagePath);
  const cacheFullPath = path.join(process.cwd(), cachePath);
  if (!fs.existsSync(cacheFullPath)) return null;
  const content = await fs.promises.readFile(cacheFullPath, "utf-8");
  return content;
};
