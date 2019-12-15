import AbstractComponent from './abstract-component.js';
import {destinations, DestinationOptions} from '../mock/destination-data.js';
import {EVENT_DEFAULT, EventTypeProperties, MovingType, PlaceholderParticle, OfferTypeOptions} from '../const.js';
import * as util from '../utils/common.js';

const createEventTypeItem = (eventType) => {
  const eventTypeCode = eventType.toLowerCase();
  return `
                            <div class="event__type-item">
                              <input id="event-type-${eventTypeCode}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeCode}">
                              <label class="event__type-label  event__type-label--${eventTypeCode}" for="event-type-${eventTypeCode}-1">${eventType}</label>
                            </div>`;
};

const createEventTypeList = () => {
  const transferEvents = Object.entries(EventTypeProperties).filter((item) => item[1].movingType === MovingType.MOVING).map((item) => item[0]).map((item) => createEventTypeItem(item)).join(`\n`);
  const activityEvents = Object.entries(EventTypeProperties).filter((item) => item[1].movingType === MovingType.STAYING).map((item) => item[0]).map((item) => createEventTypeItem(item)).join(`\n`);

  return `
                          <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Transfer</legend>
                            ${transferEvents}
                          </fieldset>

                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Activity</legend>
                            ${activityEvents}
                          </fieldset>
                        </div>`;
};

const createEventOffer = (offer) => {
  const offerOptions = OfferTypeOptions[offer.type];
  return `
                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-1" type="checkbox" name="event-offer-${offer.type}" ${offer.checked ? `checked` : ``}>
                            <label class="event__offer-label" for="event-offer-${offer.type}-1">
                              <span class="event__offer-title">${offerOptions.name}</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">${offer.cost}</span>
                            </label>
                          </div>`;
};

const createEventOffers = (offers) => {
  if (!offers.length) {
    return ``;
  }

  const eventOffersHtml = offers.map((item) => createEventOffer(item)).join(`\n`);

  return `
                      <section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                        <div class="event__available-offers">
                          ${eventOffersHtml}
                        </div>
                      </section>`;
};

const createDestinationHtml = (destination) => {
  if (!destination) {
    return ``;
  }

  const photoList = DestinationOptions[destination].photoList.map((item) => `
                                <img class="event__photo" src="${item}" alt="Event photo">`).join(`\n`);

  return `
                      <section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${DestinationOptions[destination].description}</p>

                        <div class="event__photos-container">
                          <div class="event__photos-tape">
                            ${photoList}
                          </div>
                        </div>
                      </section>`;
};

const createForm = (eventItem = EVENT_DEFAULT) => {
  const isEditForm = eventItem !== EVENT_DEFAULT;

  const eventProperty = EventTypeProperties[eventItem.type];
  const icon = eventProperty.icon;
  const title = `${eventProperty.name} ${PlaceholderParticle[eventProperty.movingType]}`;
  const destination = eventItem.destination;
  const destinationList = Object.keys(DestinationOptions).map((item) => `<option value="${item}"></option>`).join(`\n`);
  const startDateTime = `${util.getDate(eventItem.start, `/`)} ${util.getTime(eventItem.start)}`;
  const finishDateTime = `${util.getDate(eventItem.finish, `/`)} ${util.getTime(eventItem.finish)}`;

  const editFormButtons = `
                      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${eventItem.isFavorite ? `checked` : ``}>
                      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                        </svg>
                      </label>

                      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
                      </button>
`;

  return `
                <li class="trip-events__item">
                  <form class="event  event--edit" action="#" method="post">
                    <header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        ${createEventTypeList()}
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${title}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                        <datalist id="destination-list-1">
                          ${destinationList}
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateTime}">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${finishDateTime}">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventItem.cost}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">${isEditForm ? `Delete` : `Cancel`}</button>
                      ${isEditForm ? editFormButtons : ``}
                    </header>

                    <section class="event__details">

                      ${createEventOffers(eventItem.offers)}
                      ${createDestinationHtml(eventItem.destination)}

                    </section>
                  </form>
                </li>`;
};

export default class EventEditComponent extends AbstractComponent {
  constructor(eventItem) {
    super();
    this._eventItem = eventItem;
  }

  getTemplate() {
    return createForm(this._eventItem);
  }

  setRollupButtonClickHandler(handler) {
    const rollupButton = this.getElement().querySelector(`.event__rollup-btn`);
    rollupButton.addEventListener(`click`, handler);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }

  setInputFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, handler);
  }
}
