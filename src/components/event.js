import AbstractComponent from './abstract-component.js';
import {getDateTime, getTime, formatDate} from '../utils/common.js';
import {EventTypeProperties, PlaceholderParticle, OfferTypeOptions} from '../const.js';

const createOffersHtml = (offerData) => {
  const selected = offerData.filter((item) => item.checked).slice(0, 3);
  if (!selected.length) {
    return ``;
  }

  const offers = selected.map((item) => `
                      <li class="event__offer">
                        <span class="event__offer-title">${item.title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${item.cost}</span>
                       </li>`);

  return `
                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${offers.join(`\n`)}
                    </ul>`;
};

const createEventHtml = (eventItem) => {
  const eventProperty = EventTypeProperties[eventItem.type];
  const icon = eventProperty.icon;
  const title = `${eventProperty.name} ${PlaceholderParticle[eventProperty.movingType]} ${eventItem.destination}`;
  const offersHtml = createOffersHtml(eventItem.offers);

  return `
                <li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${title}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${getDateTime(eventItem.start)}">${getTime(eventItem.start)}</time>
                        &mdash;
                        <time class="event__end-time" datetime=${getDateTime(eventItem.finish)}">${getTime(eventItem.finish)}</time>
                      </p>
                      <p class="event__duration">${formatDate(eventItem.finish, eventItem.start)}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${eventItem.cost}</span>
                    </p>

                    ${offersHtml}

                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                  </div>
                </li>`;
};

export default class EventComponent extends AbstractComponent {
  constructor(eventItem) {
    super();
    this._eventItem = eventItem;
  }

  getTemplate() {
    return createEventHtml(this._eventItem);
  }

  setRollupButtonClickHandler(handler) {
    const rollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    rollupButton.addEventListener(`click`, handler);
  }
}
