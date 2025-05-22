import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

const Navbar = ({ initialSession }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    const getSession = async () => {
      const sessionData = await authClient.getSession();
      setSession(sessionData);
    };
    getSession();
  }, []);

  const isLoggedIn = !!session;

  const user = {
    name: 'John Doe',
    image: '/images/default-avatar.jpg',
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (    <nav className="bg-white shadow-lg relative top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 p-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="KomposKita Logo"
                width={200}
                height={200}
                className="rounded-full"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/rekomendasi"
                className="text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-semibold"
              >
                Rekomendasi Komposting
              </Link>
              <Link
                href="/forum"
                className="text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-semibold"
              >
                Forum
              </Link>

              {isLoggedIn ? (
                <>
                  {/* Profile Dropdown */}
                  <div className="relative ml-3">
                    <button
                      onClick={toggleProfile}
                      className="flex items-center space-x-2 text-gray-700 hover:text-amber-800 focus:outline-none"
                    >
                      <Image
                        src={user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium">
                        {session?.user?.name || user.name}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu">
                          <Link
                            href="/profile/edit"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Edit Profile
                          </Link>
                          <Link
                          href="/rekomendasi-tersimpan"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                          Rekomendasi Tersimpan
                          </Link>
                          <Link
                            href="/notifications"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Langganan Notifikasi
                          </Link>
                          <Link
                            href="/my-posts"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Post Kamu
                          </Link>
                          <button
                            onClick={() => {
                              /* TODO: Implement logout */
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="auth/signin"
                    className="text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-semibold"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="auth/signup"
                    className="bg-amber-800 text-white hover:bg-amber-700 px-4 py-2 rounded-none text-base font-semibold"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/rekomendasi"
              className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
            >
              Rekomendasi Komposting
            </Link>
            <Link
              href="/forum"
              className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
            >
              Forum
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/rekomendasi-tersimpan"
                  className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Rekomendasi Tersimpan
                </Link>
                <Link
                  href="/profile/edit"
                  className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/notifications"
                  className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Langganan Notifikasi
                </Link>
                <Link
                  href="/my-posts"
                  className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Post Kamu
                </Link>
                <button
                  onClick={() => {
                    /* TODO: Implement logout */
                  }}
                  className="w-full text-left text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-800 text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-semibold"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
