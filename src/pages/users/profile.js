import { UpdatePassword } from '@/components/UpdatePassword';
import { UpdateProfile } from '@/components/UpdateProfile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { CustomAlert } from '@/components/CustomAlert';
import { useAlert } from '@/hooks/useAlert';
import Head from 'next/head';

export default function Profile() {
  const { user, mutate } = useCurrentUser();
  const [name, setName] = useState('');
  const [nameAlert, showNameAlert] = useAlert();
  const [passwordAlert, showPasswordAlert] = useAlert();
  const [isChangingName, setIsChangingName] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [isChangingImg, setIsChangingImg] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
    }
  }, [user]);

  const updateProfileImgHandler = async (event) => {
    event.preventDefault();

    setIsChangingImg(true);

    try {
      const fileInput = fileInputRef.current;
      const file = fileInput?.files[0];

      const formData = new FormData();
      formData.append('file', file);

      await fetch('/api/users/me', {
        method: 'PUT',
        body: formData,
      });
      await mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setIsChangingImg(false);
    }
  };

  const profileUpdateHandler = async (event) => {
    event.preventDefault();
    setIsChangingName(true);

    try {
      await authClient.updateUser({
        name: name,
      });
      await mutate();
      showNameAlert('success', 'Nama berhasil diperbarui');
    } catch (error) {
      console.error('changename: error:', error);
    } finally {
      setIsChangingName(false);
    }
  };

  const changePasswordHandler = async ({ currentPassword, newPassword }) => {
    try {
      setIsChangingPwd(true);
      const response = await authClient.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.error?.code == 'INVALID_PASSWORD') {
        showPasswordAlert('error', 'Kata sandi tidak sesuai');
      } else {
        showPasswordAlert('success', 'Kata sandi berhasil diperbarui');
      }
    } catch (error) {
      console.error('changePwd: error:', error);
    } finally {
      setIsChangingPwd(false);
    }
  };

  const onChangeHandler = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <Head>Profile Saya - KomposKita</Head>
      <section>
        <div className="container mx-auto px-4 py-12">
          <div className="card sm:max-w-xl md:max-w-3xl mx-auto shadow-md p-4">
            <div>
              <h2 className="text-base-content text-2xl py-4 font-semibold border-b-2 border-gray-300">
                Profile
              </h2>
            </div>
            <div className="w-full rounded-none mt-2">
              <Image
                src={user.image || '/images/default-avatar.jpg'}
                width={150}
                height={150}
                alt="Foto profil"
              />

              <form onSubmit={updateProfileImgHandler}>
                <div className="max-w-sm mt-2">
                  <label className="label-text font-bold" htmlFor="profile-img">
                    Upload foto (Maks. 2MB)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="input rounded-sm"
                    accept="image/*"
                    htmlFor="profile-img"
                    name="file"
                  />
                </div>
                <button className="btn rounded-sm mt-2" type="submit">
                  {isChangingImg ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    ''
                  )}
                  Ganti foto profil
                </button>
              </form>

              <UpdateProfile
                name={name}
                email={user?.email || ''}
                profileUpdateHandler={profileUpdateHandler}
                onChangeHandler={onChangeHandler}
                isChangingName={isChangingName}
              />

              {nameAlert.type && (
                <CustomAlert
                  type={nameAlert.type}
                  message={nameAlert.message}
                />
              )}
            </div>
            <div>
              <h2 className="text-base-content text-xl py-4 mt-4 font-semibold border-b-2 border-gray-300">
                Ubah Password
              </h2>
            </div>
            <UpdatePassword
              changePasswordHandler={changePasswordHandler}
              isChangingPwd={isChangingPwd}
            />

            {passwordAlert.type && (
              <CustomAlert
                type={passwordAlert.type}
                message={passwordAlert.message}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
