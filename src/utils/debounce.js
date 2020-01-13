export const createDebounce = (debounceInterval, self, cb) => {
  let lastTimeout = null;
  let start = true;

  return function (param) {
    if (start) {
      start = false;
      lastTimeout = setTimeout(() => {
        start = true;
      }, debounceInterval);

      cb.call(self, param);

      return;
    }

    if (lastTimeout) {
      clearTimeout(lastTimeout);
      lastTimeout = setTimeout(() => {
        start = true;
      }, debounceInterval);
    }
  };
};

