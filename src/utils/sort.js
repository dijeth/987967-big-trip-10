import {getDaysCount} from './common.js';

const SortType = {
  DEFAULT: `default`,
  TIME: `time`,
  PRICE: `price`
};

const SortOptions = {
  [SortType.DEFAULT]: {
    name: `Event`,
    showDirection: false,
    sort: (events) => {
      events = events.sort((a, b) => +a.start - b.start);

      const days = [];
      let dayCounter = 1;
      let dayDate = events[0].start;
      let dayEvents = [events[0]];

      for (let i = 1; i < events.length; i++) {
        const daysCount = getDaysCount(dayDate, events[i].start);

        if (daysCount === 0) {
          dayEvents.push(events[i]);
          continue;
        }

        days.push({dayDate, dayCounter, dayEvents});
        dayCounter += daysCount;
        dayDate = events[i].start;
        dayEvents = [events[i]];
      }

      if (dayEvents.length) {
        days.push({dayDate, dayCounter, dayEvents});
      }

      return days;
    }
  },

  [SortType.TIME]: {
    name: `Time`,
    showDirection: true,
    sort: (events) => {
      const dayCounter = ``;
      const dayDate = ``;
      const dayEvents = events.sort((a, b) => (+b.finish - b.start) - (a.finish - a.start));

      return [{dayCounter, dayDate, dayEvents}];
    }
  },

  [SortType.PRICE]: {
    name: `Price`,
    showDirection: true,
    sort: (events) => {
      const dayCounter = ``;
      const dayDate = ``;
      const dayEvents = events.sort((a, b) => b.cost - a.cost);

      return [{dayCounter, dayDate, dayEvents}];
    }
  }
};

export {SortType, SortOptions};
