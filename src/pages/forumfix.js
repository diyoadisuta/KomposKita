import { useState } from 'react';
import { useRouter } from 'next/router';
import { PostCard } from '@/components/PostCard';

export async function getServerSideProps() {
  const responsePosts = await fetch(`${process.env.BASE_URL}/api/posts`);
  const posts = await responsePosts.json();

  return {
    props: {
      posts: posts.data ?? [],
    },
  };
}

export default function Forum({ posts }) {
  return (
    <div className="container md:mx-auto flex justify-center p-6">
      <div className="flex-col">
        <h2 className="text-base-content text-3xl py-6 font-bold">Forum</h2>
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              author={post.author}
              createdAt={post.createdAt}
              tag={post.tag}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
