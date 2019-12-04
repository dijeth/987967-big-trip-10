import createForm from './form.js';
import { MONTHS, EventType, Destinations, EventTypeProperties, PlaceholderParticle, OfferTypeOptions } from '../const.js';
import { getDaysCount, formatDate, getDateTime, getTime, getDate, getShortDate } from '../util.js';

const createTripList = (eventList, formHtml = ``) => {
  const days = [];
  let dayCounter = 1;
  let dayDate = eventList[0].start;
  let dayEvents = [eventList[0]];
  const formEvent = eventList[0];

  for (let i = 1; i < eventList.length; i++) {
    const daysCount = getDaysCount(dayDate, eventList[i].start);

    if (daysCount === 0) {
      dayEvents.push(eventList[i]);
      continue;
    };

    days.push(createTripDay(dayDate, dayCounter, createEventListHtml(dayEvents, formEvent)));
    dayCounter += daysCount;
    dayDate = eventList[i].start;
    dayEvents = [eventList[i]];
  };

  if (dayEvents.length) {
    days.push(createTripDay(dayDate, dayCounter, createEventListHtml(dayEvents)));
  };

  return `<ul class="trip-days">${days.join(`\n`)}</ul>`;
}

const createTripDay = (date, dayCounter, eventsHtml) => {
  const dateText = getShortDate(date);
  const dateTime = getDateTime(date);

  return `
	        <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${dayCounter}</span>
                <time class="day__date" datetime="${dateTime}">${dateText}</time>
              </div>
              ${eventsHtml}
            </li>`

}

const createOffersHtml = (offerData) => {
  const selected = offerData.filter((item) => item.checked).slice(0, 3);
  if (!selected.length) {
  	return ``
  };

  const offers = selected.map((item) => `
                      <li class="event__offer">
                        <span class="event__offer-title">${OfferTypeOptions[item.type].name}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${item.cost}</span>
                       </li>`);

  return `
                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
          						${offers.join(`\n`)}
          					</ul>`;
}

const createEventHtml = (eventData, isForm = false) => {
  if (isForm) {
    return createForm(eventData);
  };

  const eventProperty = EventTypeProperties[eventData.type];
  const icon = eventProperty.icon;
  const title = `${eventProperty.name} ${PlaceholderParticle[eventProperty.movingType]} ${eventData.destination}`;
  const offersHtml = createOffersHtml(eventData.offers);

  return `
				        <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${title}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${getDateTime(eventData.start)}">${getTime(eventData.start)}</time>
                        &mdash;
                        <time class="event__end-time" datetime=${getDateTime(eventData.finish)}">${getTime(eventData.finish)}</time>
                      </p>
                      <p class="event__duration">${formatDate(eventData.finish, eventData.start)}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${eventData.cost}</span>
                    </p>

                    ${offersHtml}

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`
};

const createEventListHtml = (eventList, formEvent) => {
  return `
	              <ul class="trip-events__list">
	              	${eventList.map((item) => createEventHtml(item, item === formEvent)).join(`\n`)}
	              </ul>`
};

export default createTripList;
