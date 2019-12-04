import {getRandomNumber, getRandomElement, getRandomBoolean} from '../util.js';
import {OfferType} from '../const.js';

export const generateOfferList = () => {
  const set = new Set();
  const offerCount = getRandomNumber(5);
  const offerTypes = Object.values(OfferType);

  for (let i = 0; i < offerCount; i++) {
    set.add(getRandomElement(offerTypes));
  }

  const offers = [];
  set.forEach((item) => {
    offers.push({type: item, checked: getRandomBoolean(), cost: getRandomNumber(200)});
  });

  return offers;
};
