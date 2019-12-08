import { Months, TimeValue } from './const.js'

export const getRandomNumber = (max, min = 0) => Math.round(min + Math.random() * (max - min));

export const getRandomElement = (array) => array[getRandomNumber(array.length - 1)];

export const getRandomBoolean = () => {
  return Math.random() > 0.5 ? true : false;
};

const formatNumber = (number) => number < 10 ? `0${number}` : `${number}`;

const getRandomDate = (dateStart, during) => {
  const time = getRandomNumber(+dateStart + during, +dateStart + TimeValue.HOUR);

  let date = new Date();
  date.setTime(time);

  return date;
}

export const getRandomHour = (dateStart) => getRandomDate(dateStart, TimeValue.HOUR);
export const getRandomTwoHours = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_HOURS);
export const getRandomHalfDay = (dateStart) => getRandomDate(dateStart, TimeValue.HALF_DAY);
export const getRandomDay = (dateStart) => getRandomDate(dateStart, TimeValue.DAY);
export const getRandomTwoDays = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_DAYS);
export const getRandomWeek = (dateStart) => getRandomDate(dateStart, TimeValue.WEEK);
export const getRandom2Week = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_WEEKS);

export const getDaysCount = (dateMin, dateMax) => {
  const dateMinCopy = new Date(+dateMin);
  dateMinCopy.setSeconds(0);
  dateMinCopy.setMinutes(0);
  dateMinCopy.setHours(0);
  return Math.floor((+dateMax - dateMinCopy) / TimeValue.DAY);
}

export const getShortYear = (date) => String(date.getFullYear()).substr(2, 2);
export const getDate = (date, separator = '-') => `${getShortYear(date)}${separator}${formatNumber(date.getMonth()+1)}${separator}${formatNumber(date.getDate())}`;
export const getTime = (date) => `${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}`;
export const getDateTime = (date) => `${getDate(date)}T${getTime(date)}`;

export const formatDate = (date1, date2) => {
  let time = Math.abs(+date1 - date2);
  let daysCount = Math.floor(time / TimeValue.DAY);

  time -= daysCount * TimeValue.DAY;
  let hoursCount = Math.floor(time / TimeValue.HOUR);

  time -= hoursCount * TimeValue.HOUR;
  let minutesCount = Math.round(time / TimeValue.MINUTE);

  daysCount = daysCount > 0 ? `${formatNumber(daysCount)}D` : ``;
  hoursCount = hoursCount === 0 && daysCount === 0 ? `` : `${formatNumber(hoursCount)}H`;
  minutesCount = `${formatNumber(minutesCount)}M`;

  return `${daysCount} ${hoursCount} ${minutesCount}`.replace(/  +/g, ' ');
}

export const getShortDate = (date) => `${date.getDate()} ${Months[date.getMonth()]}`;

export const RenderElementPosition = {
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`
};

export const renderElement = (container, position, ...elements) => {
  switch (position) {
    case RenderElementPosition.BEFORE_BEGIN:
      container.before(...elements);
      break;

    case RenderElementPosition.AFTER_BEGIN:
      container.prepend(...elements);
      break;

    case RenderElementPosition.BEFORE_END:
      container.append(...elements);
      break;

    case RenderElementPosition.AFTER_END:
      container.after(...elements);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const splitEventsByDay = (eventList) => {
  const days = [];
  let dayCounter = 1;
  let dayDate = eventList[0].start;
  let dayEvents = [eventList[0]];

  for (let i = 1; i < eventList.length; i++) {
    const daysCount = getDaysCount(dayDate, eventList[i].start);

    if (daysCount === 0) {
      dayEvents.push(eventList[i]);
      continue;
    }

    days.push({ dayDate: dayDate, dayCounter: dayCounter, dayEvents: dayEvents });
    dayCounter += daysCount;
    dayDate = eventList[i].start;
    dayEvents = [eventList[i]];
  }

  if (dayEvents.length) {
    days.push({ dayDate: dayDate, dayCounter: dayCounter, dayEvents: dayEvents });
  }

  return days;
};
