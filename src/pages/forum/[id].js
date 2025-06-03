import { CommentCard } from '@/components/CommentCard';
import { CommentInput } from '@/components/CommentInput';
import { CustomAlert } from '@/components/CustomAlert';
import { CustomButton } from '@/components/CustomButton';
import { useAlert } from '@/hooks/useAlert';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CommentService } from '@/services/comment';
import { PostService } from '@/services/post';
import { useState } from 'react';
import dayjs from 'dayjs';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Head from 'next/head';

export async function getStaticPaths() {
  const posts = await PostService.getPosts();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = await PostService.getPostById(params.id);
  const comments = await CommentService.getPostComments(params.id);

  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    deletedAt: post.deletedAt ? post.deletedAt.toISOString() : null,
  };

  const serializedComments = comments.map((comment) => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  }));

  return {
    props: { post: serializedPost ?? [], comments: serializedComments ?? [] },
  };
}

export default function PostPage({ post, comments }) {
  const { user } = useCurrentUser();
  const [showAlert, setShowAlert] = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const createdAt = new Date(post.createdAt);
  const updatedAt = new Date(post.updatedAt);
  const formattedUpdatedAt = dayjs(updatedAt).format('MMMM D, YYYY HH:mm');
  const formattedCreatedAt = dayjs(createdAt).format('MMMM D, YYYY HH:mm');
  const isEdited = updatedAt > createdAt;

  const onEditHandler = async (event) => {
    const formData = new FormData(event.target);
    const title = formData.get('title');
    const description = formData.get('description');

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      return;
    }

    setShowAlert('success', 'Post berhasil diperbarui');
  };

  const onDeleteHandler = async (event) => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return;
    }

    setShowAlert('success', 'Post berhasil dihapus');
  };

  return (
    <>
      <Head>
        <title>Forum - KomposKita</title>
      </Head>

      <div className="min-h-[100vh">
        <div className="container md:mx-auto flex justify-center p-6">
          <div className="flex-col">
            <div className="card sm:max-w-xl md:min-w-2xl mx-auto rounded-none">
              {isEditing ? (
                <div className="card-body">
                  <form onSubmit={onEditHandler}>
                    <div className="w-full">
                      <label
                        className="label-text text-base font-semibold"
                        htmlFor="title"
                      >
                        Judul
                      </label>
                      <input
                        type="text"
                        className="input rounded-sm"
                        id="title"
                        name="title"
                        defaultValue={post.title}
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        className="label-text text-base font-semibold"
                        htmlFor="description"
                      >
                        Keterangan
                      </label>
                      <textarea
                        className="input rounded-sm min-h-[100px]"
                        id="description"
                        name="description"
                        defaultValue={post.description}
                        required
                      />
                    </div>

                    {showAlert.type && (
                      <CustomAlert
                        type={showAlert.type}
                        message={showAlert.message}
                      />
                    )}

                    <button
                      className="btn btn-primary btn-sm rounded-none mt-2"
                      type="submit"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-primary btn-sm rounded-none mt-2"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Batal
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="card-header">
                    <div className="flex justify-between">
                      <h5 className="card-title">{post.title}</h5>

                      {user && user.id == post.userId && !post.deletedAt && (
                        <div className="items-end flex gap-2">
                          <CustomButton
                            onClick={() => setIsEditing(true)}
                            icon={faPenToSquare}
                          />
                          <CustomButton
                            onClick={onDeleteHandler}
                            icon={faTrash}
                          />
                        </div>
                      )}
                    </div>

                    <p>{formattedCreatedAt}</p>

                    <p className="text-base">
                      <span className="icon-[line-md--account] size-3"></span>
                      {post.author}
                    </p>
                  </div>

                  {post.deletedAt ? (
                    <div className="card-body min-h-[200px]">
                      <p className="italic">
                        Postingan telah dihapus oleh penulis
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="card-body min-h-[200px]">
                        <p className="text-black">{post.description}</p>
                      </div>

                      <div className="card-footer">
                        {isEdited && (
                          <p className="italic">
                            Diupdate pada {formattedUpdatedAt}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="card card-sm md:max-w-2xl sm:max-w-sm rounded-none p-2">
              <div className="card-header">
                <h5 className="card-title border-b-2">Komentar</h5>
              </div>
              <div className="card-body min-h-[200px]">
                <CommentInput postId={post.id} />
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    id={comment.id}
                    postId={post.id}
                    author={comment.author}
                    message={comment.message}
                    createdAt={comment.createdAt}
                    userId={comment.userId}
                    currentUser={user}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
