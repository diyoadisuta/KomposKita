import { useRouter } from 'next/router';
import { RadioButton } from './RadioButton';

export const PostInput = ({ tags, onSubmit, isLoggedIn, isLoading }) => {
  const router = useRouter();

  const handleSubmit = (event) => {
    if (!isLoggedIn) {
      router.push('/auth/signin');
      return;
    }
    onSubmit(event);
  };

  return (
    <div>
      <div className="card card-sm w-full sm:min-w-md md:min-w-2xl rounded-none">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
                disabled={!isLoggedIn}
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
                type="text"
                className="input w-full rounded-sm min-h-[100px] p-2"
                id="description"
                name="description"
                disabled={!isLoggedIn}
                required
              />
            </div>
            <RadioButton tags={tags} />
            <button
              className="btn btn-primary btn-sm rounded-none mt-2"
              type="submit"
              disabled={!isLoggedIn}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                ''
              )}
              {isLoggedIn ? 'Tambah Post' : 'Masuk untuk menambahkan post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
