const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const FilterOptions = {
  [FilterType.EVERYTHING]: {
    name: `Everything`,
    check() {
      return true;
    }
  },

  [FilterType.FUTURE]: {
    name: `Future`,
    check(event) {
      return event.start > Date.now();
    }
  },

  [FilterType.PAST]: {
    name: `Past`,
    check(event) {
      return event.start < Date.now();
    }
  }
};

export {FilterType, FilterOptions};
