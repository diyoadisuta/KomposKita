import dayjs from 'dayjs';
import { useState } from 'react';
import { CustomButton } from './CustomButton';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const CommentCard = ({ id, postId, author, message, createdAt, userId, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const formattedDate = dayjs(createdAt).format('MMMM D, YYYY HH:mm');

  const handleEdit = async () => {
    const response = await fetch(`/api/posts/${postId}/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: editedMessage }),
    });

    if (response.ok) {
      setIsEditing(false);
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah anda yakin ingin menghapus komentar ini?')) return;
    
    const response = await fetch(`/api/posts/${postId}/comments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="ccard card-sm md:max-w-2xl sm:max-w-sm rounded-none" key={id}>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h5 className="text-base font-medium">
              <span className="icon-[line-md--account] size-3"></span>
              {author}
            </h5>
            {currentUser && currentUser.id === userId && (
              <div className="flex gap-2">
                <CustomButton onClick={() => setIsEditing(!isEditing)} icon={faPenToSquare} />
                <CustomButton onClick={handleDelete} icon={faTrash} />
              </div>
            )}
          </div>
          <p>{formattedDate}</p>
        </div>
        <div className="card-body">
          {isEditing ? (
            <div>
              <textarea
                className="input w-full rounded-sm"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                  Simpan
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
