import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { auth } from '@/lib/auth';

// Mock data for demonstration
const initialPosts = [
  {
    id: 1,
    title: 'Tips Komposting di Rumah',
    author: 'Budi Santoso',
    tag: 'berbagi',
    date: '2024-03-15',
    content: 'Berikut beberapa tips untuk memulai komposting di rumah...',
    comments: [
      {
        id: 1,
        author: 'Ani Wijaya',
        content: 'Terima kasih tipsnya!',
        date: '2024-03-15',
      },
      {
        id: 2,
        author: 'Dewi Putri',
        content: 'Sangat membantu!',
        date: '2024-03-16',
      },
    ],
  },
  {
    id: 2,
    title: 'Mengapa Kompos Saya Berbau?',
    author: 'Siti Aminah',
    tag: 'bertanya',
    date: '2024-03-14',
    content:
      'Saya sudah mencoba membuat kompos tapi hasilnya berbau tidak sedap...',
    comments: [
      {
        id: 1,
        author: 'Rudi Hartono',
        content: 'Mungkin terlalu banyak bahan basah',
        date: '2024-03-14',
      },
    ],
  },
];

export const getServerSideProps = async ({ req }) => {
  const session = await auth.api.getSession({
    headers: await req.headers,
  });

  return {
    props: {
      session: session
        ? {
            id: session.user.id,
            name: session.user.name,
            image: session.user.image,
          }
        : null,
    },
  };
};

export default function Forum({ session }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tag: 'berbagi',
  });
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      ...newPost,
      author: 'Current User', // Replace with actual user
      date: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setPosts([post, ...posts]);
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', tag: 'berbagi' });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: selectedPost.comments.length + 1,
      author: 'Current User', // Replace with actual user
      content: newComment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedPost = {
      ...selectedPost,
      comments: [...selectedPost.comments, comment],
    };

    setPosts(posts.map((p) => (p.id === selectedPost.id ? updatedPost : p)));
    setSelectedPost(updatedPost);
    setNewComment('');
  };

  const handleEditPost = (post) => {
    setIsEditing(true);
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, tag: post.tag });
    setShowNewPostForm(true);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      setPosts(posts.filter((p) => p.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...editingPost,
      ...newPost,
      date: new Date().toISOString().split('T')[0],
    };

    setPosts(posts.map((p) => (p.id === editingPost.id ? updatedPost : p)));
    if (selectedPost?.id === editingPost.id) {
      setSelectedPost(updatedPost);
    }
    setIsEditing(false);
    setEditingPost(null);
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', tag: 'berbagi' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forum Komposting</h1>
          <button
            onClick={() => {
              setShowNewPostForm(true);
              setIsEditing(false);
              setEditingPost(null);
              setNewPost({ title: '', content: '', tag: 'berbagi' });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Buat Post Baru
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Post' : 'Buat Post Baru'}
            </h2>
            <form
              onSubmit={isEditing ? handleEditSubmit : handleNewPostSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Judul
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Keterangan
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tag
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="berbagi"
                      checked={newPost.tag === 'berbagi'}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tag: e.target.value })
                      }
                      className="form-radio text-green-600"
                    />
                    <span className="ml-2">Berbagi</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="bertanya"
                      checked={newPost.tag === 'bertanya'}
                      onChange={(e) =>
                        setNewPost({ ...newPost, tag: e.target.value })
                      }
                      className="form-radio text-green-600"
                    />
                    <span className="ml-2">Bertanya</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setIsEditing(false);
                    setEditingPost(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {isEditing ? 'Update Post' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">Oleh: {post.author}</p>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.tag === 'berbagi'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {post.tag}
                </span>
              </div>
              <p className="mt-2 text-gray-700 line-clamp-2">{post.content}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPost(post);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPost.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Oleh: {selectedPost.author}
                    </p>
                    <p className="text-sm text-gray-500">{selectedPost.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedPost.tag === 'berbagi'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedPost.tag}
                  </span>
                </div>
                <p className="mt-4 text-gray-700">{selectedPost.content}</p>

                {/* Comments Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Komentar</h3>
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">
                            {comment.author}
                          </p>
                          <p className="text-sm text-gray-500">
                            {comment.date}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* New Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mt-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis komentar..."
                      rows="3"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Kirim Komentar
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
