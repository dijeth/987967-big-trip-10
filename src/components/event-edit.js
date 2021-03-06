import AbstractSmartComponent from './abstract-smart-component.js';
import {isDateInRanges, isDatesInRanges} from '../utils/common.js';
import {showErrorMessage} from '../utils/render.js';
import {EventTypeProperties, MovingType, PlaceholderParticle, EventMode, ProcessingState, TimeValue, ValidityError} from '../const.js';
import FlatpickrRange from '../utils/flatpickr-range.js';
import he from 'he';

const ANIMATION_LENGTH = 600;

const isCostValid = (value) => {
  switch (true) {
    case isNaN(value):
      return false;

    case Math.round(value) !== value:
      return false;

    case value <= 0:
      return false;

    default:
      return true;
  }
};

const getDataRangeValidity = (dateStart, dateFinish, disabledRanges, enabledRanges) => {
  switch (true) {
    case !dateStart:
      return ValidityError.EMPTY_START_DATE;

    case isDateInRanges(disabledRanges, dateStart, true):
      return ValidityError.DISABLED_START_DATE;

    case !dateFinish:
      return ValidityError.EMPTY_FINISH_DATE;

    case isDateInRanges(disabledRanges, dateFinish, true):
      return ValidityError.DISABLED_FINISH_DATE;

    case +dateFinish <= +dateStart:
      return ValidityError.NEGATIVE_DATE_RANGE;

    case !isDatesInRanges(enabledRanges, dateStart, dateFinish):
      return ValidityError.WRONG_DATE_RANGE;

    default:
      return ``;
  }
};

const getFormValidity = (eventItem, disabledRanges, enabledRanges) => {
  const dateMessages = getDataRangeValidity(eventItem.start, eventItem.finish, disabledRanges, enabledRanges);
  const messages = [];

  if (dateMessages) {
    messages.push(dateMessages);
  }

  if (!eventItem.destination) {
    messages.push(ValidityError.EMPTY_DESTINATION);
  }

  if (!isCostValid(eventItem.cost)) {
    messages.push(ValidityError.WRONG_COST_FORMAT);
  }

  return messages;
};

const showFormValidity = (form, messages) => {
  showErrorMessage(``, form.querySelector(`.event__field-group--destination`));
  showErrorMessage(``, form.querySelector(`.event__field-group--time`));
  showErrorMessage(``, form.querySelector(`.event__field-group--price`));

  form.querySelector(`.event__save-btn`).disabled = messages.length > 0;

  messages.forEach((message) => {
    switch (message) {
      case ValidityError.EMPTY_DESTINATION:
        showErrorMessage(message, form.querySelector(`.event__field-group--destination`));
        break;

      case ValidityError.EMPTY_START_DATE:
      case ValidityError.EMPTY_FINISH_DATE:
      case ValidityError.DISABLED_START_DATE:
      case ValidityError.DISABLED_FINISH_DATE:
      case ValidityError.NEGATIVE_DATE_RANGE:
      case ValidityError.WRONG_DATE_RANGE:
        showErrorMessage(message, form.querySelector(`.event__field-group--time`));
        break;

      case ValidityError.WRONG_COST_FORMAT:
        showErrorMessage(message, form.querySelector(`.event__field-group--price`));
        break;
    }
  });
};

const createEventTypeItem = (eventType, checked) => {
  const eventTypeCode = eventType.toLowerCase();
  const eventTypeName = EventTypeProperties[eventType].name;
  return `
  <div class="event__type-item">
    <input id="event-type-${eventTypeCode}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeCode}"${checked ? ` checked` : ``}>
    <label class="event__type-label  event__type-label--${eventTypeCode}" for="event-type-${eventTypeCode}">${eventTypeName}</label>
  </div>`;
};

const createEventTypeList = (eventType) => {
  const transferEvents = Object.entries(EventTypeProperties)
    .filter((item) => item[1].movingType === MovingType.MOVING)
    .map((item) => createEventTypeItem(item[0], item[0] === eventType)).join(`\n`);

  const activityEvents = Object.entries(EventTypeProperties)
    .filter((item) => item[1].movingType === MovingType.STAYING)
    .map((item) => createEventTypeItem(item[0], item[0] === eventType)).join(`\n`);

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

const joinOffers = (eventOffers, eventTypeOffers) => {
  const eventOffersDict = {};
  const eventTypeOffersDict = {};

  eventOffers.forEach((it) => {
    eventOffersDict[it.title] = Object.assign({}, it);
    eventOffersDict[it.title].checked = true;
  });

  eventTypeOffers.forEach((it) => {
    eventTypeOffersDict[it.title] = Object.assign({}, it);
    eventTypeOffersDict[it.title].checked = false;
  });

  const joinedEventOffers = Object.assign({}, eventTypeOffersDict, eventOffersDict);
  const resultOffers = Object.values(joinedEventOffers);

  return resultOffers;
};

const createEventOffer = (offer, index) => {
  return `
                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}" type="checkbox" name="event-offer-${index}" ${offer.checked ? `checked` : ``}>
                            <label class="event__offer-label" for="event-offer-${index}">
                              <span class="event__offer-title">${offer.title}</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
                            </label>
                          </div>`;
};

const createEventOffers = (eventOffers, eventTypeOffers) => {
  if (!eventOffers.length && !eventTypeOffers.length) {
    return ``;
  }

  const offers = joinOffers(eventOffers, eventTypeOffers);

  const eventOffersHtml = offers.map((it, i) => createEventOffer(it, i)).join(`\n`);

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

  const photoList = destination.pictures.map((it) => `
                                <img class="event__photo" src="${it.src}" alt="${it.description}">`).join(`\n`);

  return `
                      <section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
                        <p class="event__destination-description">${destination.description}</p>

                        <div class="event__photos-container">
                          <div class="event__photos-tape">
                            ${photoList}
                          </div>
                        </div>
                      </section>`;
};

const createForm = (eventItem, destinations, offers, mode, errorState) => {
  const isNewEvent = mode === EventMode.ADDING;

  const eventProperty = EventTypeProperties[eventItem.type];
  const icon = eventProperty.icon;
  const title = `${eventProperty.name} ${PlaceholderParticle[eventProperty.movingType]}`;
  const destination = eventItem.destination ? eventItem.destination.name : ``;
  const destinationList = destinations.map((item) => `<option value="${item.name}"></option>`).join(`\n`);
  const destinationHtml = createDestinationHtml(eventItem.destination);
  const offersHtml = createEventOffers(eventItem.offers, offers[eventItem.type]);

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
                ${isNewEvent ? `` : `<li class="trip-events__item">`}
                  <form class="${isNewEvent ? `trip-events__item ` : ``}event  event--edit${errorState ? ` event--error` : ``}" action="#" method="post">
                    <header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        ${createEventTypeList(eventItem.type)}
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${title}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" name="event-destination" value="${destination}" list="destination-list-1">
                        <datalist id="destination-list-1">
                          ${destinationList}
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${(he.encode(String(eventItem.cost)))}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">${isNewEvent ? `Cancel` : `Delete`}</button>
                      ${isNewEvent ? `` : editFormButtons}
                    </header>

                    <section class="event__details">

                      ${offersHtml}
                      ${destinationHtml}

                    </section>
                  </form>
                ${isNewEvent ? `` : `</li>`}`;
};

export default class EventEditComponent extends AbstractSmartComponent {
  constructor(eventItem, disabledRanges, destinations, offers, mode) {
    super();
    this._eventItem = eventItem.clone();
    this._disabledRanges = disabledRanges;
    this._enabledRanges = this._getEnabledRanges(disabledRanges);
    this._destinations = destinations;
    this._offers = offers;
    this._mode = mode;

    this._dateRangeChangeHandler = this._dateRangeChangeHandler.bind(this);

    this._addListeners();

    this._flatpickrRange = this._createFlatpickrRange();

    this._errorState = false;
  }

  getTemplate() {
    return createForm(this._eventItem, this._destinations, this._offers, this._mode, this._errorState);
  }

  getElement() {
    const element = super.getElement();
    showFormValidity(element, getFormValidity(this._eventItem, this._disabledRanges, this._enabledRanges));
    return element;
  }

  getData() {
    return this._eventItem;
  }

  setRollupButtonClickHandler(handler) {
    this._setHandler(
        handler,
        this.getElement().querySelector(`.event__rollup-btn`),
        `_rollupButtonClickHandler`,
        `click`
    );
  }

  setSubmitHandler(handler) {
    const form = this._getFormElement();
    this._setHandler(
        handler,
        form,
        `_submitHandler`,
        `submit`
    );
  }

  setFavoriteClickHandler(handler) {
    this._setHandler(
        handler,
        this.getElement().querySelector(`.event__favorite-checkbox`),
        `_inputFavoriteChangeHandler`,
        `click`
    );
  }

  setDeleteButtonClickHandler(handler) {
    this._setHandler(
        handler,
        this.getElement().querySelector(`.event__reset-btn`),
        `_deleteButtonClickHandler`,
        `click`
    );
  }

  setErrorState() {
    this._enableForm();
    this._getFormElement().classList.add(`shake`);
    this._errorState = true;
    setTimeout(this.rerender.bind(this), ANIMATION_LENGTH);
  }

  setState(processingState) {
    let buttonElement;

    switch (processingState) {
      case ProcessingState.DELETING:
        buttonElement = this.getElement().querySelector(`button[type=reset]`);
        break;

      default:
      case ProcessingState.SAVING:
        buttonElement = this.getElement().querySelector(`button[type=submit]`);
    }

    this._resetErrorState();
    buttonElement.textContent = processingState;
    this._disableForm();
  }

  setID(newID) {
    this._eventItem.id = newID;
  }

  rerender() {
    super.rerender();
    this._flatpickrRange = this._createFlatpickrRange();
  }

  recoveryListeners() {
    this._addListeners();

    this.setRollupButtonClickHandler();
    this.setSubmitHandler();
    this.setFavoriteClickHandler();
    this.setDeleteButtonClickHandler();
  }

  removeElement() {
    if (this._flatpickrRange) {
      this._flatpickrRange.destroy();
      this._flatpickrRange = null;
    }

    super.removeElement();
  }

  reset(eventItem) {
    this._eventItem = eventItem.clone();
    this.rerender();
  }

  _resetErrorState() {
    this._errorState = false;
    this._getFormElement().classList.remove(`event--error`);
  }

  _setHandler(handler, element, handlerKeeperName, eventName) {
    if (!element) {
      return;
    }

    if (handler) {
      this[handlerKeeperName] = handler;
    }

    if (this[handlerKeeperName]) {
      element.addEventListener(eventName, (evt) => {
        this[handlerKeeperName](evt);
      });
    }
  }

  _addListeners() {
    const element = this.getElement();

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const destination = this._destinations.find((it) => it.name === evt.target.value);
      this._eventItem.destination = destination || this._eventItem.destination;

      this.rerender();
      this._setSubmitDisableStatus();
    });

    element.querySelectorAll(`.event__type-input`).forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        this._eventItem.type = evt.target.value;
        this._eventItem.offers = [];

        this.rerender();
      });
    });

    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._eventItem.cost = +evt.target.value;

      this._setSubmitDisableStatus();
    });

    const offersElement = element.querySelector(`.event__available-offers`);
    if (offersElement) {
      offersElement.addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        const labelElement = evt.currentTarget.querySelector(`[for="${evt.target.id}"]`);
        const offerTitle = labelElement.querySelector(`.event__offer-title`).textContent;
        const offerPrice = Number(labelElement.querySelector(`.event__offer-price`).textContent);
        const offerIndex = this._eventItem.offers.findIndex((it) => it.title === offerTitle && it.price === offerPrice);

        if (offerIndex === -1) {
          this._eventItem.offers.push({title: offerTitle, price: offerPrice});
        } else {
          this._eventItem.offers = this._eventItem.offers.filter((it) => it.title !== offerTitle && it.price !== offerPrice);
        }
      });
    }
  }

  _createFlatpickrRange() {
    return new FlatpickrRange(
        this.getElement().querySelector(`#event-start-time`),
        this.getElement().querySelector(`#event-end-time`),
        this._eventItem.start,
        this._eventItem.finish,
        this._disabledRanges,
        this._dateRangeChangeHandler
    );
  }

  _getFormElement() {
    return this.getElement().tagName === `FORM` ? this.getElement() : this.getElement().querySelector(`form`);
  }

  _disableForm() {
    Array.from(this._getFormElement().elements).forEach((it) => {
      it.disabled = true;
    });
    this._getFormElement().classList.add(`event--disabled`);
  }

  _enableForm() {
    Array.from(this._getFormElement().elements).forEach((it) => {
      it.disabled = false;
    });
    this._getFormElement().classList.remove(`event--disabled`);
  }

  _getEnabledRanges(disabledRanges) {
    const enabledRages = [{
      from: TimeValue.MIN_DATE,
      to: TimeValue.MAX_DATE
    }];

    disabledRanges.forEach((it) => {
      const lastIndex = enabledRages.length - 1;

      const newRange = {
        from: it.to,
        to: enabledRages[lastIndex].to
      };

      enabledRages[lastIndex].to = it.from;

      enabledRages.push(newRange);
    });

    return enabledRages;
  }

  _setSubmitDisableStatus() {
    const validityMessages = getFormValidity(this._eventItem, this._disabledRanges, this._enabledRanges);
    showFormValidity(this._element, validityMessages);
    return validityMessages;
  }

  _dateRangeChangeHandler(dateStart, dateFinish) {
    this._eventItem.start = dateStart;
    this._eventItem.finish = dateFinish;
    return this._setSubmitDisableStatus();
  }
}
