import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  try {
    const responseTags = await fetch(`${process.env.BASE_URL}/api/posts/tags`);
    const responsePosts = await fetch(`${process.env.BASE_URL}/api/posts`);

    const [tags, posts] = await Promise.all([
      responseTags.json(),
      responsePosts.json(),
    ]);

    return {
      props: {
        tags: tags.data || [],
        posts: posts.data || [],
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        tags: [],
        posts: [],
        error: 'Failed to fetch data',
      },
    };
  }
}

export default function Forum({ tags = [], posts: initialPosts = [] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    tag: tags.length > 0 ? tags[0].id : '',
  });
  const [newComment, setNewComment] = useState('');
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !newPost.title.trim() ||
        !newPost.description.trim() ||
        !newPost.tag
      ) {
        alert('Please fill in all required fields');
        return;
      }

      const postData = {
        title: newPost.title.trim(),
        description: newPost.description.trim(),
        tagId: newPost.tag, // Changed from tag to tagId
      };

      console.log('Sending post data:', postData); // Debug log

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      });

      // Check if response is not ok before trying to parse JSON
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        const errorData = await response.json().catch(() => ({
          message: 'Server error occurred',
        }));
        throw new Error(errorData.message || 'Failed to create post');
      }

      const result = await response.json();

      // Add the new post to the posts list with the returned data
      const newPostWithData = {
        ...result.data,
        author: 'You',
        comments: [],
      };

      setPosts([newPostWithData, ...posts]);
      setShowNewPostForm(false);
      setNewPost({
        title: '',
        description: '',
        tag: tags.length > 0 ? tags[0].id : '', // Changed to use tag ID
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.message || 'Failed to create post. Please try again.');
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message: newComment.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Failed to add comment');
      }

      const result = await response.json();

      // Update the post with new comment
      const updatedPost = {
        ...selectedPost,
        comments: [...selectedPost.comments, result.data],
      };

      setPosts(posts.map((p) => (p.id === selectedPost.id ? updatedPost : p)));
      setSelectedPost(updatedPost);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  // Function to fetch comments for a post
  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  // Update handlePostClick to fetch comments
  const handlePostClick = async (post) => {
    const comments = await fetchComments(post.id);
    setSelectedPost({ ...post, comments });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forum Komposting</h1>{' '}
          <button
            onClick={() => {
              setShowNewPostForm(true);
              setIsEditing(false);
              setNewPost({
                title: '',
                description: '',
                tag: tags.length > 0 ? tags[0].id : '',
              });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Buat Post Baru
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl text-black font-semibold mb-4">
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
                  value={newPost.description}
                  onChange={(e) =>
                    setNewPost({ ...newPost, description: e.target.value })
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
                <div className="mt-2">
                  <select
                    value={newPost.tag}
                    onChange={(e) =>
                      setNewPost({ ...newPost, tag: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="">Pilih Tag</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPostForm(false);
                    setIsEditing(false);
                    setNewPost({
                      title: '',
                      description: '',
                      tag: tags.length > 0 ? tags[0].id : '',
                    });
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
              <p className="mt-2 text-gray-700 line-clamp-2">
                {post.description}
              </p>
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
                {/* Comments Section */}{' '}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Komentar</h3>
                  <div className="space-y-4">
                    {selectedPost?.comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-900">
                            {comment.authorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.message}</p>
                      </div>
                    )) || <p>Belum ada komentar</p>}
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
    </div>
  );
}
