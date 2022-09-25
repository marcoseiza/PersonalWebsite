import { useEffect, useState } from "react";
import type { MDInstance } from "../../helpers/types";
import PlaceHolderPosts from "./placeholder-posts";
import Post from "./post";

const postComparator = (a: MDInstance, b: MDInstance) =>
  new Date(b.frontmatter.date).getTime() -
  new Date(a.frontmatter.date).getTime();

export default function LoadPosts() {
  const [posts, setPosts] = useState<MDInstance[]>([]);

  useEffect(() => {
    Object.values(import.meta.glob("../../pages/posts/*.md") as any).map(
      (v: any) =>
        v().then((post: MDInstance) => {
          setPosts((curPosts) => curPosts.concat(post));
        })
    );
  }, []);

  return (
    <ul className={"react-article-list"}>
      {posts.length > 0 ? (
        posts
          .sort(postComparator)
          .map((p, i) => !p.frontmatter.draft && <Post post={p} key={i} />)
      ) : (
        <PlaceHolderPosts />
      )}
    </ul>
  );
}
