export type Post = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  publishedTime: string;
  modifiedTime: string;
  content: string;
};

export type Photo = {
  slug: string;
  place: string;
  date: string | null;
  camera: string | null;
  fnumber: number;
  iso: number;
  focalLength: number;
  exposureTime: number;
  width: string;
  height: string;
  blurDataURL?: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  keywords: string;
  year: string | null;
  tags: {
    text: string;
    type: string;
  }[];
  content: string;
};
