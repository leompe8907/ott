import KEY_CODES from './KeyCodes';

let currentHandler = null;

const handleKeyDown = (event) => {
  const keyCode = event.keyCode || event.which;

  if (typeof currentHandler === 'function') {
    currentHandler(keyCode);
  }
};

const setHandler = (handler) => {
  currentHandler = handler;
};

const removeHandler = () => {
  currentHandler = null;
};

const start = () => {
  document.addEventListener('keydown', handleKeyDown);
};

const stop = () => {
  document.removeEventListener('keydown', handleKeyDown);
};

export default {start, stop, setHandler, removeHandler, KEY_CODES};
