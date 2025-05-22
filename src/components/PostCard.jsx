import Link from 'next/link';
import dayjs from 'dayjs';

export const PostCard = ({ id, title, author, createdAt, tag }) => {
  const formattedDate = dayjs(createdAt).format('MMMM D, YYYY HH:mm');

  return (
    <Link href={`/forum/${id}`}>
      <div
        className="card card-sm w-full sm:min-w-xl md:min-w-3xl rounded-none"
        key={id}
      >
        <div className="card-header flex-row flex justify-between">
          <h5 className="card-title">{title}</h5>
          <p className="text-base">
            <span className="icon-[line-md--account] size-3"></span>
            {author}
          </p>
        </div>
        <div className="card-footer flex-row flex justify-between">
          <p>{formattedDate}</p>
          <span className="badge badge-info rounded-full">{tag}</span>
        </div>
      </div>
    </Link>
  );
};
