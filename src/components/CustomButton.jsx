import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CustomButton = ({ onClick, icon }) => {
  return (
    <>
      <button onClick={onClick}>
        <FontAwesomeIcon icon={icon} fixedWidth />
      </button>
    </>
  );
};
