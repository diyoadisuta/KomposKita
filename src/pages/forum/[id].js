import { CommentCard } from '@/components/CommentCard';
import { CommentInput } from '@/components/CommentInput';
import { CommentService } from '@/services/comment';
import { PostService } from '@/services/post';

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
  return (
    <div className="container md:mx-auto flex justify-center p-6">
      <div className="flex-col">
        <div className="card card-sm min-w-3xl sm:max-w-sm rounded-none p-2">
          <div className="card-header">
            <h5 className="card-title">{post.title}</h5>
            <p className="text-base">
              <span className="icon-[line-md--account] size-3"></span>
              {post.author}
            </p>
          </div>
          <div className="card-body min-h-[200px]">
            <p>{post.description}</p>
          </div>
        </div>
        <div className="card card-sm min-w-3xl sm:max-w-sm rounded-none p-2">
          <div className="card-header">
            <h5 className="card-title border-b-2">Komentar</h5>
          </div>
          <div className="card-body min-h-[200px]">
            <CommentInput postId={post.id} />
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                author={comment.author}
                message={comment.message}
                createdAt={comment.createdAt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
