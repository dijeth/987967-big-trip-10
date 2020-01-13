export const createDebounce = (debounceInterval, self, cb) => {
  let lastTimeout = null;
  let start = true;

  return function () {
    if (start) {
      start = false;
      lastTimeout = setTimeout(() => {
        start = true;
      }, debounceInterval);
      cb.apply(self, arguments);

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

