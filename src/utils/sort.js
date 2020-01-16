import {getDaysCount} from './common.js';

const SortType = {
  DEFAULT: `event`,
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

      events.forEach((event, index) => {
        if (index === 0) {
          return;
        };

        const daysCount = getDaysCount(dayDate, event.start);

        if (daysCount === 0) {
          dayEvents.push(event);
          return;
        }

        days.push({dayDate, dayCounter, dayEvents});
        dayCounter += daysCount;
        dayDate = event.start;
        dayEvents = [event];
      });

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
