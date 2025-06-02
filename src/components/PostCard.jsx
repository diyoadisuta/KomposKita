import { useRouter } from 'next/router';
import dayjs from 'dayjs';

export const PostCard = ({ id, title, author, createdAt, tag }) => {
  const router = useRouter();
  const formattedDate = dayjs(createdAt).format('MMMM D, YYYY HH:mm');

  return (
    <tr
      className="row-hover"
      key={id}
      onClick={() => router.push(`/forum/${id}`)}
    >
      <td className="cursor-pointer">{author}</td>
      <td className="cursor-pointer break-words">{title}</td>
      <td className="cursor-pointer">{formattedDate}</td>
      <td className="cursor-pointer">
        <span className="badge badge-default text-md">{tag}</span>
      </td>
    </tr>
  );
};
