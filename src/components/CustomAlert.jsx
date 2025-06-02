export const CustomAlert = ({ type, message }) => {
  return (
    <div
      className={`alert alert-outline alert-${type} flex items-center gap-4 mt-4`}
      role="alert"
    >
      <p>{message}</p>
    </div>
  );
};
