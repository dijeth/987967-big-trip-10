import {getRandomElement, getRandomWeek, getRandomTwoDays, getRandomNumber, getRandomBoolean} from '../utils/common.js';
import {EventType, EVENT_DEFAULT} from '../const.js';
import {destinations} from './destination-data.js';
import {generateOfferList} from './offer-data.js';

const generateEventData = (startData) => {
  const event = {};

  Object.assign(event, EVENT_DEFAULT);

  event.type = getRandomElement(Object.values(EventType));
  event.start = startData;
  event.finish = getRandomTwoDays(event.start);
  event.destination = getRandomElement(destinations);
  event.cost = getRandomNumber(1000, 20);
  event.isFavorite = getRandomBoolean();

  event.offers = generateOfferList(event.type);

  return event;
};

const generateEventList = () => {
  const eventCount = getRandomNumber(10, 5);
  const eventList = [];
  let startData = getRandomWeek(new Date());

  for (let i = 0; i < eventCount; i++) {
    const eventData = generateEventData(startData);
    startData = eventData.finish;

    eventList.push(eventData);
  }

  return eventList;
};

export default generateEventList;
