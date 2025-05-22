export const CommentInput = ({ postId }) => {
  async function onSubmit(event) {
    const formData = new FormData(event.target);
    const message = formData.get('message');
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      event.target.reset();
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Tambah komentar"
          className="input max-w-fill text-base rounded-md min-h-[50px]"
          required
        />
        <button
          className="btn btn-primary btn-sm rounded-md mt-2"
          type="submit"
        >
          Tambah komentar
        </button>
      </form>
    </div>
  );
};
