import { PostCard } from '@/components/PostCard';
import { PostInput } from '@/components/PostInput';
import { auth } from '@/lib/auth';
import { PostService } from '@/services/post';
import { TagService } from '@/services/tag';
import Head from 'next/head';

export async function getServerSideProps({ req }) {
  const user = await auth.api.getSession({
    headers: await req.headers,
  });

  const isLoggedIn = !!user;

  const posts = await PostService.getPosts();
  const tags = await TagService.getTags();

  const serializedPosts = posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));
  return {
    props: {
      posts: serializedPosts ?? [],
      tags,
      isLoggedIn,
    },
  };
}

export default function Forum({ posts, tags, isLoggedIn }) {
  async function onSubmit(event) {
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const tagId = formData.get('tagId');

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, tagId }),
    });

    if (response.ok) {
      event.target.reset();
    }
  }

  return (
    <>
      <Head>
        <title>Forum - KomposKita</title>
      </Head>

      <div className="sm:mx-auto flex justify-center my-8">
        <div className="flex-col border-2 p-6 rounded-sm border-gray-200 justify-center">
          <h2 className="text-base-content text-3xl py-4 font-bold">Forum</h2>
          <PostInput tags={tags} isLoggedIn={isLoggedIn} onSubmit={onSubmit} />
          <div className="w-full sm:min-w-md md:min-w-2xl rounded-none">
            <table className="table">
              <thead className="bg-amber-500">
                <tr>
                  <th>Nama</th>
                  <th>Judul</th>
                  <th>Tanggal</th>
                  <th>Tag</th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
