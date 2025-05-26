import { UpdatePassword } from '@/components/UpdatePassword';
import { UpdateProfile } from '@/components/UpdateProfile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { CustomAlert } from '@/components/CustomAlert';
import { useAlert } from '@/hooks/useAlert';

export default function Profile() {
  const { user, mutate } = useCurrentUser();
  const [name, setName] = useState('');
  const [nameAlert, showNameAlert] = useAlert();
  const [passwordAlert, showPasswordAlert] = useAlert();

  useEffect(() => {
    if (user) {
      setName(user.fullName);
    }
  }, [user]);

  const profileUpdateHandler = async (event) => {
    event.preventDefault();

    await authClient.updateUser({
      name: name,
    });
    await mutate();
    showNameAlert('success', 'Nama berhasil diperbarui');
  };

  const changePasswordHandler = async ({ currentPassword, newPassword }) => {
    try {
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
    }
  };

  const onChangeHandler = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <section>
        <div className="sm:mx-auto flex justify-center my-8">
          <div className="flex flex-col border-2 p-6 rounded-sm border-gray-200 justify-center gap-4">
            <div>
              <h2 className="text-base-content text-2xl py-4 font-semibold border-b-2 border-gray-300">
                Profile
              </h2>
            </div>
            <div className="w-full sm:min-w-md md:min-w-2xl rounded-none">
              <Image
                src="/images/default-avatar.jpg"
                width={150}
                height={150}
                alt="Foto profil"
              />
              <UpdateProfile
                name={name}
                email={user?.email}
                profileUpdateHandler={profileUpdateHandler}
                onChangeHandler={onChangeHandler}
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
            <UpdatePassword changePasswordHandler={changePasswordHandler} />

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
