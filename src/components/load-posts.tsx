import { useEffect, useState } from "react";
import type { MarkdownInstance } from "astro";
import { Article } from "phosphor-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

type MDInstance = MarkdownInstance<Record<string, any>>;

const postComparator = (a: MDInstance, b: MDInstance) =>
  new Date(b.frontmatter.date).getTime() -
  new Date(a.frontmatter.date).getTime();

interface PostProps {
  index: number;
  post?: MDInstance;
}

const Post = ({ post, index }: PostProps) => {
  return (
    <SkeletonTheme baseColor="transparent" enableAnimation={false}>
      <li key={index}>
        <a className={"react-card"} href={post?.url}>
          <div className={"react-flex row alignFlexStart"}>
            <Article
              size={32}
              weight="bold"
              color="var(--color-card-text)"
              style={{
                marginRight: "1em",
                marginTop: "0.15em",
                flexShrink: 0,
              }}
            />
            <h2 className="fancy-text react-article-title">
              {post?.frontmatter.title || <Skeleton width={"10em"} />}
            </h2>
          </div>
          <h4>{post?.frontmatter.date || <Skeleton width={"5em"} />}</h4>
        </a>
      </li>
    </SkeletonTheme>
  );
};

const PlaceHolderPosts = () => {
  return (
    <>
      <Post index={0} />
      <Post index={1} />
      <Post index={2} />
    </>
  );
};

export const LoadPosts = () => {
  const [posts, setPosts] = useState<MDInstance[]>([]);

  useEffect(() => {
    Object.values(import.meta.glob("../pages/posts/*.md") as any).map(
      (v: any) =>
        v()
          .then((post: MDInstance) => {
            return new Promise<MDInstance>((r) =>
              setTimeout(() => r(post), 300)
            );
          })
          .then((post: MDInstance) => {
            setPosts((curPosts) => curPosts.concat(post));
          })
    );
  }, []);

  return (
    <ul className={"react-article-list"}>
      {posts.length > 0 ? (
        posts
          .sort(postComparator)
          .map((p, i) => !p.frontmatter.draft && <Post post={p} index={i} />)
      ) : (
        <PlaceHolderPosts />
      )}
    </ul>
  );
};
