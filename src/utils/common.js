import moment from 'moment';
import {TimeValue, MIN_EVENT_DURATION} from '../const.js';

const getRandomNumber = (max, min = 0) => Math.round(min + Math.random() * (max - min));

const getRandomElement = (array) => array[getRandomNumber(array.length - 1)];

const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

const getRandomDate = (dateStart, during) => {
  const time = getRandomNumber(+dateStart + during, +dateStart + TimeValue.HOUR);

  let date = new Date();
  date.setTime(time);

  return date;
};

const getRandomHour = (dateStart) => getRandomDate(dateStart, TimeValue.HOUR);
const getRandomTwoHours = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_HOURS);
const getRandomHalfDay = (dateStart) => getRandomDate(dateStart, TimeValue.HALF_DAY);
const getRandomDay = (dateStart) => getRandomDate(dateStart, TimeValue.DAY);
const getRandomTwoDays = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_DAYS);
const getRandomWeek = (dateStart) => getRandomDate(dateStart, TimeValue.WEEK);
const getRandom2Week = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_WEEKS);

const getDaysCount = (dateMin, dateMax) => {
  return Math.floor(moment.duration(+dateMax - moment(dateMin).startOf(`day`).toDate()).asDays());
};

const getDate = (date, separator = `-`) => date ? moment(date).format(`YY${separator}MM${separator}D`) : ``;
const getTime = (date) => date ? moment(date).format(`HH:mm`) : ``;
const getDateTime = (date) => date ? moment(date).format(`YYYY-MM-D[T]HH:mm`) : ``;

const formatDate = (date1, date2) => {
  const ms = Math.abs(+date1 - date2);
  const daysCount = Math.floor(moment.duration(ms).asDays());
  const time = moment(new Date(ms)).utc().format(`H[H] mm[M]`);

  return `${daysCount > 0 ? `${daysCount}D ` : ``}${time}`;
};

const getShortDate = (date) => date ? moment(date).format(`D MMM`) : ``;

const isDateInRange = (range, date, strong = false) => {
  const dateValue = Math.floor(date / TimeValue.MINUTE);
  const fromValue = Math.floor(range.from / TimeValue.MINUTE);
  const toValue = Math.floor(range.to / TimeValue.MINUTE);

  if (strong) {
    return dateValue > fromValue && dateValue < toValue;
  }

  return dateValue >= fromValue && dateValue <= toValue;
};

const getDateRange = (ranges, date, strong = false) => {
  return ranges.find((range) => isDateInRange(range, date, strong));
};

const isDateInRanges = (ranges, date, strong = false) => {
  return ranges.some((range) => isDateInRange(range, date, strong));
};

const isDatesInRange = (range, ...dates) => {
  return dates.every((date) => isDateInRange(range, date));
};

const isDatesInRanges = (ranges, ...dates) => {
  return ranges.some((range) => isDatesInRange(range, ...dates));
};

const getDatesRange = (ranges, ...dates) => {
  return ranges.find((range) => isDatesInRange(range, ...dates));
};

const flatDateRanges = (ranges) => {
  if (!ranges.length) {
    return [];
  }

  const sortedRanges = ranges.slice().sort((a, b) => +a.from - b.from);
  const flatedRanges = [];
  let range = sortedRanges[0];

  sortedRanges.forEach((sortedRange, index) => {
    if (index === 0) {
      return;
    }

    if (+sortedRange.from - range.to < MIN_EVENT_DURATION) {
      range.to = sortedRange.to;
    } else {
      flatedRanges.push(range);
      range = sortedRange;
    }
  });

  flatedRanges.push(range);

  return flatedRanges;
};

const isRangesEqual = (...ranges) => {
  return ranges.every((it) => ranges[0].from === it.from && ranges[0].to === it.to);
};

const toSentenceCase = (string) => {
  return string.substr(0, 1).toUpperCase() + string.substr(1);
};

export {
  getRandomNumber,
  getRandomElement,
  getRandomBoolean,
  getRandomHour,
  getRandomTwoHours,
  getRandomHalfDay,
  getRandomDay,
  getRandomTwoDays,
  getRandomWeek,
  getRandom2Week,
  getDaysCount,
  getDate,
  getTime,
  getDateTime,
  formatDate,
  getShortDate,
  isDateInRange,
  getDateRange,
  isDateInRanges,
  isDatesInRange,
  isDatesInRanges,
  getDatesRange,
  flatDateRanges,
  isRangesEqual,
  toSentenceCase
};
