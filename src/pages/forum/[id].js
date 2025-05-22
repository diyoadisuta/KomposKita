export async function getStaticPaths() {
  const responsePosts = await fetch(`${process.env.BASE_URL}/api/posts`);
  const posts = await responsePosts.json();

  const paths = posts.data.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const responsePosts = await fetch(
    `${process.env.BASE_URL}/api/posts/${params.id}`
  );
  const responseComments = await fetch(
    `${process.env.BASE_URL}/api/posts/${params.id}/comments`
  );

  const post = await responsePosts.json();
  const comments = await responseComments.json();

  return { props: { post: post.data, comments: comments.data } };
}

export default function PostPage({ post }) {
  return (
    <div className="container md:mx-auto flex justify-center p-6">
      <div className="flex-col">
        <div className="card card-sm min-w-3xl sm:max-w-sm rounded-none">
          <div className="card-header">
            <h5 className="card-title">{post.title}</h5>
            <p className="text-base">
              <span className="icon-[line-md--account] size-3"></span>
              {post.author}
            </p>
          </div>
          <div className="card-body min-h-[250px]">
            <p>{post.description}</p>
          </div>
        </div>
        <div className="card card-sm min-w-3xl sm:max-w-sm rounded-none">
          <div className="card-header">
            <h5 className="card-title border-b-2">Komentar</h5>
          </div>
          <div className="card-body min-h-[200px]">
            {/* TODO: COMMENT */}
            <p>{post.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
