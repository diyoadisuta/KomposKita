export const CustomAlert = ({ type, message }) => {
  return (
    <div
      className={`alert alert-soft alert-${type} flex items-center gap-4 mt-4`}
      role="alert"
    >
      <span className="icon-[tabler--circle-check] shrink-0 size-6"></span>
      <p>{message}</p>
    </div>
  );
};
