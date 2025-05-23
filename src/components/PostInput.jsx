import { useRouter } from 'next/router';
import { RadioButton } from './RadioButton';

export const PostInput = ({ tags, onSubmit, isLoggedIn }) => {
  const router = useRouter();

  const handleIsLoggedInClick = () => {
    if (!isLoggedIn) {
      router.push('/auth/signin');
    }
  };

  return (
    <div>
      <button
        type="button"
        className="collapse-toggle btn btn-soft btn-sm rounded-none my-4"
        id="basic-collapse"
        aria-expanded="false"
        aria-controls="basic-collapse-heading"
        data-collapse="#basic-collapse-heading"
        onClick={handleIsLoggedInClick}
      >
        Tambah Post
        <span className="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
      </button>
      <div
        id="basic-collapse-heading"
        className="collapse hidden w-full overflow-hidden transition-[height] duration-300"
        aria-labelledby="basic-collapse"
      >
        <div className="card card-sm w-full sm:min-w-md md:min-w-2xl rounded-none">
          <div className="card-body">
            <form onSubmit={onSubmit}>
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
                <input
                  type="text"
                  className="input rounded-sm min-h-[100px]"
                  id="description"
                  name="description"
                  required
                />
              </div>
              <RadioButton tags={tags} />
              <button
                className="btn btn-primary btn-sm rounded-none mt-2"
                type="submit"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
