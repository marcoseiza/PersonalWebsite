import type { MDInstance } from "./types";

export type Module<T> = () => Promise<T>;

export const fetchPostImportModules = () => {
  return Object.values(import.meta.glob("../posts/*.md") as any) as Module<MDInstance>[];
}

export const updatePostUrl = (post: MDInstance): MDInstance => ({
  ...post,
  url: `/posts/${post.frontmatter.slug}`
})

export const isValidPost = (post: MDInstance) => 
  !post.frontmatter.draft && !post.frontmatter.archive;

export const postFilter = (post: MDInstance) : MDInstance | [] => 
  (!post.frontmatter.draft && !post.frontmatter.archive) ? post : [];


export const postComparator = (a: MDInstance, b: MDInstance) =>
  new Date(b.frontmatter.date).getTime() -
  new Date(a.frontmatter.date).getTime();

export const sortPosts = (posts: MDInstance[]) => posts.sort(postComparator);

export const filterAndSortPosts = (posts: MDInstance[]) : MDInstance[] => 
  sortPosts(posts.filter(isValidPost))

export interface Tasks {
  ToDo: string[];
  Doing: string[];
  Done: string[];
}

export const DefaultTasks = () : Tasks=> ({
  ToDo: [],
  Doing: [],
  Done: []
})

export interface TaskDBEntry {
  properties: {
    Status: {
      select: {
        name: keyof Tasks;
      };
    };
    Name: {
      title: { text: { content: string } }[];
    };
  };
}
