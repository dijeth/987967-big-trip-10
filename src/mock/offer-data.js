import {getRandomNumber, getRandomBoolean} from '../utils/common.js';
import {EventTypeProperties} from '../const.js';

export const generateOfferList = (eventType) => {
  const availableOfferTypes = EventTypeProperties[eventType].availableOfferTypes;
  const offers = availableOfferTypes ? Array.from(availableOfferTypes).map((it) => {
    return {
      type: it,
      checked: getRandomBoolean(),
      cost: getRandomNumber(200)
    };
  }) : [];

  return offers;
};
