import { useEffect, useState } from "react";
import {
  fetchPostImportModules,
  updatePostUrl,
  Module,
  isValidPost,
  sortPosts,
} from "../../helpers/";
import type { MDInstance } from "../../helpers/types";
import PlaceHolderPosts from "./placeholder-posts";
import PostCard from "./post-card";

export default function LoadPosts(props: any) {
  const [modules, setModules] = useState<Module<MDInstance>[]>([]);
  const [posts, setPosts] = useState<MDInstance[]>([]);
  const [isDoneLoading, setDoneLoading] = useState<boolean>(false);

  useEffect(() => {
    const modules = fetchPostImportModules();
    setModules(modules);
    modules.map(async (v: Module<MDInstance>) => {
      const post = await v();
      setPosts((posts) => sortPosts(posts.concat(post)));
    });
  }, []);

  useEffect(() => {
    setDoneLoading(posts.length === modules.length);
  }, [posts]);

  const render = () => {
    if (posts.length === 0) {
      return <PlaceHolderPosts />;
    }

    const filteredPosts = posts.filter(isValidPost);
    if (filteredPosts.length === 0) {
      return props.noPosts;
    }

    return filteredPosts.map((p, i) => (
      <PostCard post={updatePostUrl(p)} key={i} showPreview={false} />
    ));
  };

  return (
    <ul
      className={"react-article-list"}
      id={isDoneLoading ? "posts-loaded" : "loading-posts"}
    >
      {render()}
    </ul>
  );
}
