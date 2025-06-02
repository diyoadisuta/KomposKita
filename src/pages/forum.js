import { PostCard } from '@/components/PostCard';
import { PostInput } from '@/components/PostInput';
import { CustomAlert } from '@/components/CustomAlert';
import { useAlert } from '@/hooks/useAlert';
import { auth } from '@/lib/auth';
import { PostService } from '@/services/post';
import { TagService } from '@/services/tag';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export async function getServerSideProps({ req }) {
  const user = await auth.api.getSession({
    headers: await req.headers,
  });

  const isLoggedIn = !!user;

  const [posts, tags] = await Promise.all([
    PostService.getPosts(),
    TagService.getTags(),
  ]);

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
  const router = useRouter();
  const [showAlert, setShowAlert] = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsPageLoading(true);
    const handleComplete = () => setIsPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
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
        setShowAlert('success', 'Post berhasil ditambahkan!');
        router.push('/forum');
      }
    } catch (error) {
      console.error('createPost: error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isPageLoading) {
    return (
      <>
        <Head>
          <title>Forum - KomposKita</title>
        </Head>
        <div className="min-h-[100vh] flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-xl"></span>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Forum - KomposKita</title>
      </Head>

      <div className="min-h-[100vh] bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="card sm:max-w-xl md:max-w-4xl mx-auto shadow-md rounded-none">
            <div className="card-body">
              <h2 className="text-base-content text-3xl py-4 font-bold">
                Forum
              </h2>
              <PostInput
                tags={tags}
                isLoggedIn={isLoggedIn}
                onSubmit={onSubmit}
                isLoading={isLoading}
              />
              {showAlert.type && (
                <CustomAlert
                  type={showAlert.type}
                  message={showAlert.message}
                />
              )}
              <div className="border-base-content/25 w-full overflow-x-auto rounded-none">
                <table className="table">
                  <thead className="bg-amber-500">
                    <tr>
                      <th>Nama</th>
                      <th>Judul</th>
                      <th>Tanggal</th>
                      <th>Kategori</th>
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
        </div>
      </div>
    </>
  );
}
