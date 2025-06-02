import { useState } from 'react';

export const UpdatePassword = ({ changePasswordHandler, isChangingPwd }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onHandleSubmit = (event) => {
    event.preventDefault();

    changePasswordHandler({
      currentPassword,
      newPassword,
    });
  };

  return (
    <>
      <form onSubmit={onHandleSubmit}>
        <div className="max-w-96 flex flex-col gap-2">
          <label className="label-text font-bold" htmlFor="oldPasword">
            Password Lama<span className="text-red-600"> *</span>
          </label>
          <input
            type="password"
            className="input rounded-none"
            id="oldPasword"
            name="currentPassword"
            value={currentPassword}
            required
            onChange={(event) => setCurrentPassword(event.target.value)}
          />

          <label className="label-text font-bold" htmlFor="newPasword">
            Password Baru<span className="text-red-600"> *</span>
          </label>
          <input
            type="password"
            className="input rounded-none"
            id="newPasword"
            name="newPassword"
            value={newPassword}
            required
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <button className="btn rounded-sm mt-4">
          {isChangingPwd ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            ''
          )}
          Ubah Password
        </button>
      </form>
    </>
  );
};
