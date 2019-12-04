import {getShortDate} from '../util.js';

const getDateTitle = (eventList) => {
  return `${getShortDate(eventList[0].start)}&nbsp;&mdash;&nbsp;${getShortDate(eventList[eventList.length - 1].finish)}`
};

const createTripInfo = (eventList) => {
  const shortTrip = eventList.length > 2 ? [eventList[0].destination, `...`, eventList[eventList.length - 1].destination] : [eventList[0].destination, eventList[1].destination];

  return `
            <div class="trip-info__main">
              <h1 class="trip-info__title">${shortTrip.join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${getDateTitle(eventList)}</p>
            </div>`;
};

export default createTripInfo;
