import moment from 'moment';
import {Months, TimeValue} from '../const.js';

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
};

export const getRandomHour = (dateStart) => getRandomDate(dateStart, TimeValue.HOUR);
export const getRandomTwoHours = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_HOURS);
export const getRandomHalfDay = (dateStart) => getRandomDate(dateStart, TimeValue.HALF_DAY);
export const getRandomDay = (dateStart) => getRandomDate(dateStart, TimeValue.DAY);
export const getRandomTwoDays = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_DAYS);
export const getRandomWeek = (dateStart) => getRandomDate(dateStart, TimeValue.WEEK);
export const getRandom2Week = (dateStart) => getRandomDate(dateStart, TimeValue.TWO_WEEKS);

export const getDaysCount = (dateMin, dateMax) => {
  return Math.floor(moment.duration(+dateMax - moment(dateMin).startOf('day').toDate()).asDays());
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
