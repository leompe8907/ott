import KEY_CODES from '../KeyCodes';

export const defaultKeyHandler = (keyCode) => {
  if (keyCode >= KEY_CODES.NUM_0 && keyCode <= KEY_CODES.NUM_9) {
    const num = keyCode - KEY_CODES.NUM_0;
    console.log("Número:", num);
    return;
  }

  switch (keyCode) {
    case KEY_CODES.UP:
      console.log("↑ Arriba");
      break;
    case KEY_CODES.DOWN:
      console.log("↓ Abajo");
      break;
    case KEY_CODES.ENTER:
      console.log("✔️ Enter");
      break;
    case KEY_CODES.BACK:
    case KEY_CODES.RETURN:
      console.log("⏪ Volver");
      break;
    case KEY_CODES.PLAY:
      console.log("▶️ Play");
      break;
    // Agregás más si querés
  }
};
