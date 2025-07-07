import KEY_CODES from '../KeyCodes';

export const loginKeyHandler = ({ onSubmit, onBack }) => (keyCode) => {
  switch (keyCode) {
    case KEY_CODES.ENTER:
      onSubmit();
      break;

    case KEY_CODES.BACK:
    case KEY_CODES.RETURN:
      onBack();
      break;

    default:
      break;
  }
};
