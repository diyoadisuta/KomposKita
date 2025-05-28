import dayjs from 'dayjs';

export const CommentCard = ({ id, author, message, createdAt }) => {
  const formattedDate = dayjs(createdAt).format('MMMM D, YYYY HH:mm');

  return (
    <div>
      <div
        className="card card-sm w-full sm:min-w-xl md:min-w-2xl rounded-none"
        key={id}
      >
        <div className="card-header">
          <h5 className="text-base font-medium">
            <span className="icon-[line-md--account] size-3"></span>
            {author}
          </h5>
          <p>{formattedDate}</p>
        </div>
        <div className="card-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};
