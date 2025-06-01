import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { authClient } from '@/lib/auth-client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGear,
  faPenToSquare,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

export const Navbar = () => {
  const router = useRouter();
  const { user, mutate } = useCurrentUser();

  const isLoggedIn = !!user;

  const signOutHandler = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          mutate(null);
          router.push('/');
        },
      },
    });
  };

  return (
    <nav className="navbar bg-base-100 md:h-18 px-4 md:px-20 sticky top-0 start-0 z-50 shadow-base-300/20 shadow-sm">
      <div className="w-full md:flex md:items-center md:gap-2">
        <div className="flex items-center justify-between">
          <div className="navbar-start items-center justify-between max-md:w-full">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="KomposKita Logo"
                width={30}
                height={30}
              />
              <p className="text-green-700 font-bold text-lg">
                Kompos
                <span className="text-yellow-700 font-bold text-lg">Kita</span>
              </p>
            </Link>
            <div className="md:hidden">
              <button
                type="button"
                className="collapse-toggle btn btn-outline btn-secondary btn-sm btn-square"
                data-collapse="#navbar-collapse"
                aria-controls="navbar-collapse"
                aria-label="Toggle navigation"
              >
                <span className="icon-[tabler--menu-2] collapse-open:hidden size-4"></span>
                <span className="icon-[tabler--x] collapse-open:block hidden size-4"></span>
              </button>
            </div>
          </div>
        </div>
        <div
          id="navbar-collapse"
          className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full"
        >
          <ul className="menu md:menu-horizontal gap-2 p-0 font-semibold text-base max-md:mt-2 items-center">
            <li>
              <Link href="/periksa-bahan">Periksa Bahan Komposting</Link>
            </li>
            <li>
              <Link href="/informasi">Informasi</Link>
            </li>
            <li>
              <Link href="/forum">Forum</Link>
            </li>

            {isLoggedIn ? (
              <li className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                <button
                  id="dropdown-link"
                  type="button"
                  className="dropdown-toggle dropdown-open:bg-base-content/10 dropdown-open:text-base-content"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-label="Dropdown"
                >
                  <Image
                    src={user.image || '/images/default-avatar.jpg'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {user.fullName}
                  <span className="icon-[tabler--chevron-down] dropdown-open:rotate-180 size-4"></span>
                </button>
                <ul
                  className="dropdown-menu dropdown-open:opacity-100  hidden"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="dropdown-link"
                >
                  <li>
                    <Link href="/users/profile" className="dropdown-item">
                      <FontAwesomeIcon icon={faUserGear} fixedWidth />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/perhitungan-tersimpan"
                      className="dropdown-item"
                    >
                      <FontAwesomeIcon icon={faBookmark} fixedWidth />
                      Perhitungan Tersimpan
                    </Link>
                  </li>
                  <li>
                    <Link href="/#" className="dropdown-item">
                      <FontAwesomeIcon icon={faPenToSquare} fixedWidth />
                      Post Kamu
                    </Link>
                  </li>
                  <hr className="border-base-content/25 -mx-2" />
                  <li>
                    <button
                      onClick={signOutHandler}
                      className="dropdown-item text-red-500"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} fixedWidth />
                      Keluar
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/auth/signin">Masuk</Link>
                </li>

                <li>
                  <Link
                    href="/auth/signup"
                    className="bg-amber-800 text-white hover:bg-amber-700 hover:text-white px-4 py-2 rounded-none text-base font-semibold"
                  >
                    Daftar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
