import PostCard from "./post-card";

export default function PlaceHolderPosts() {
  return (
    <>
      <PostCard key={0} showPreview={false} />
      <PostCard key={1} showPreview={false} />
      <PostCard key={2} showPreview={false} />
    </>
  );
}
