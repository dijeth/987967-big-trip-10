import moment from 'moment';
import { TimeValue, MIN_EVENT_DURATION } from '../const.js';

export const getRandomNumber = (max, min = 0) => Math.round(min + Math.random() * (max - min));

export const getRandomElement = (array) => array[getRandomNumber(array.length - 1)];

export const getRandomBoolean = () => {
  return Math.random() > 0.5 ? true : false;
};

const getRandomDate = (dateStart, during) => {
  const time = getRandomNumber(+dateStart + during, +dateStart + TimeValue.HOUR);

  let date = new Date();
  date.setTime(time);

  return date;
};

export const getRandomHour = (dateStart) => getRandomDate(dateStart, TimeValue.HOUR);
export const getRandomTwoHours = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_HOURS);
export const getRandomHalfDay = (dateStart) => getRandomDate(dateStart, TimeValue.HALF_DAY);
export const getRandomDay = (dateStart) => getRandomDate(dateStart, TimeValue.DAY);
export const getRandomTwoDays = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_DAYS);
export const getRandomWeek = (dateStart) => getRandomDate(dateStart, TimeValue.WEEK);
export const getRandom2Week = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_WEEKS);

export const getDaysCount = (dateMin, dateMax) => {
  return Math.floor(moment.duration(+dateMax - moment(dateMin).startOf(`day`).toDate()).asDays());
};

export const getDate = (date, separator = `-`) => date ? moment(date).format(`YY${separator}MM${separator}D`) : ``;
export const getTime = (date) => date ? moment(date).format(`HH:mm`) : ``;
export const getDateTime = (date) => date ? moment(date).format(`YYYY-MM-D[T]HH:mm`) : ``;

export const formatDate = (date1, date2) => {
  const ms = Math.abs(+date1 - date2);
  const daysCount = Math.floor(moment.duration(ms).asDays());
  const time = moment(new Date(ms)).utc().format(`H[H] mm[M]`);

  return `${daysCount > 0 ? `${daysCount}D ` : ``}${time}`;
};

export const getShortDate = (date) => date ? moment(date).format(`D MMM`) : ``;

export const isDateInRange = (range, date, strong = false) => {
  const dateValue = Math.floor(date / TimeValue.MINUTE);
  const fromValue = Math.floor(range.from / TimeValue.MINUTE);
  const toValue = Math.floor(range.to / TimeValue.MINUTE);

  if (strong) {
    return dateValue > fromValue && dateValue < toValue;
  }

  return dateValue >= fromValue && dateValue <= toValue;
};

export const getDateRange = (ranges, date, strong = false) => {
  return ranges.find((range) => isDateInRange(range, date, strong));
};

export const isDateInRanges = (ranges, date, strong = false) => {
  return ranges.some((range) => isDateInRange(range, date, strong));
};

export const isDatesInRange = (range, ...dates) => {
  return dates.every((date) => isDateInRange(range, date));
};

export const isDatesInRanges = (ranges, ...dates) => {
  return ranges.some((range) => isDatesInRange(range, ...dates));
};

export const getDatesRange = (ranges, ...dates) => {
  return ranges.find((range) => isDatesInRange(range, ...dates));
};

export const flatDateRanges = (ranges) => {
  if (!ranges.length) {
    return [];
  }

  let sortedRanges = ranges.slice().sort((a, b) => +a.from - b.from);
  let range = sortedRanges[0];
  const flatedRanges = [];

  for (let i = 1; i < sortedRanges.length; i++) {
    if (+sortedRanges[i].from - range.to < MIN_EVENT_DURATION) {
      range.to = sortedRanges[i].to;
    } else {
      flatedRanges.push(range);
      range = sortedRanges[i];
    }
  }

  flatedRanges.push(range);

  return flatedRanges;
};

export const isRangesEqual = (...ranges) => {
  return ranges.every((it) => ranges[0].from === it.from && ranges[0].to === it.to);
};

export const toSentenceCase = (string) => {
  return string.substr(0, 1).toUpperCase() + string.substr(1);
};
