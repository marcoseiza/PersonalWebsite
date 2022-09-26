import PostCard from "./post-card";

export default function PlaceHolderPosts() {
  return (
    <>
      <PostCard key={0} />
      <PostCard key={1} />
      <PostCard key={2} />
    </>
  );
}
