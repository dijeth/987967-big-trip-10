'use strict';

const tripList = [`Amsterdam`, `Vienna`, `Budapest`];
const dateList = [`Mar 21`, `Mar 25`, `Mar 31`];
const filterList = [`Everything`, `Future`, `Past`];
const tripDayList = [{
    dayCounter: 1,
    dayDate: `2019-03-18`,
    dayDateText: `MAR 18`,

    eventList: [
      { type: `flight`, title: `Flight to Geneva`, startTime: `12:25`, endTime: `13:35`, duration: `1H 30M`, price: `160`, offers: [{ title: `Add luggage`, price: `50` }, { title: `Switch to comfort`, price: `80` }] },
      { type: `check-in`, title: `Check into hotel`, startTime: `12:25`, endTime: `13:35`, duration: `1H 30M`, price: `600`, offers: [{ title: `Add breakfast`, price: `50` }] }
    ]
  },
  {
    dayCounter: 2,
    dayDate: `2019-03-19`,
    dayDateText: `MAR 19`,

    eventList: [
      { type: `drive`, title: `Drive to Geneva`, startTime: `10:00`, endTime: `11:00`, duration: `1H`, price: `20`, offers: [] }
    ]
  }
];

const EventIconDict = {
  taxi: `taxi.png`,
  bus: `bus.png`,
  train: `train.png`,
  ship: `ship.png`,
  transport: `transport.png`,
  drive: `drive.png`,
  flight: `flight.png`,
  'check-in': `check-in.png`,
  sightseeing: `sightseeing.png`,
  restaurant: `restaurant.png`
}

const getDateTitle = (datePoints) => `${datePoints[0]}&nbsp;&mdash;&nbsp;${datePoints[datePoints.length-1]}`;

const render = (container, html, position = 'beforeend') => {
  container.insertAdjacentHTML(position, html);
}

const createTrip = (tripPoints, datePoints) => {
  const shortTrip = tripPoints.length > 2 ? [tripPoints[0], '...', tripPoints[tripPoints.length - 1]] : tripPoints;

  return `
            <div class="trip-info__main">
              <h1 class="trip-info__title">${shortTrip.join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${getDateTitle(datePoints)}</p>
            </div>`
};

const createMenu = () => `
            <nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
              <a class="trip-tabs__btn" href="#">Stats</a>
            </nav>`;

const createFilterItem = (name, checked = false) => `
              <div class="trip-filters__filter">
                <input id="filter-${name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.toLowerCase()}" ${checked ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-${name.toLowerCase()}">${name}</label>
              </div>`;

const createFilter = (filterNames, checkedIndex = 0) => {
  return `
	        <form class="trip-filters" action="#" method="get">
	          ${ filterNames.map((item, index) => createFilterItem(item, index === checkedIndex)).join(`\n`) }
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`
};

const createSort = (checkedValue = `sort-event`) => `
          <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day">Day</span>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event"${checkedValue === `sort-event` ? `checked` : ``}>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"${checkedValue === `sort-time` ? `checked` : ``}>
              <label class="trip-sort__btn" for="sort-time">
                Time
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"${checkedValue === `sort-price` ? `checked` : ``}>
              <label class="trip-sort__btn" for="sort-price">
                Price
                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                </svg>
              </label>
            </div>

            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>
`;

const createTripDays = (dayList) =>
  `
          <ul class="trip-days">
          	${createForm()}
            ${dayList.map((item) => `
            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${item.dayCounter}</span>
                <time class="day__date" datetime="${item.dayDate}">${item.dayDateText}</time>
              </div>
              ${createEventList(item.eventList, item.dayDate)}
            </li>`).join(`\n`)}
          </ul>
`;

const createEventList = (eventList, date) => `
	              <ul class="trip-events__list">
	              	${eventList.map((item) => `
	                <li class="trip-events__item">
	                  <div class="event">
	                    <div class="event__type">
	                      <img class="event__type-icon" width="42" height="42" src="img/icons/${item.type}.png" alt="Event type icon">
	                    </div>
	                    <h3 class="event__title">${item.title}</h3>

	                    <div class="event__schedule">
	                      <p class="event__time">
	                        <time class="event__start-time" datetime="${date}T${item.startTime}">${item.startTime}</time>
	                        &mdash;
	                        <time class="event__end-time" datetime="${date}T${item.endTime}">${item.endTime}</time>
	                      </p>
	                      <p class="event__duration">${item.duration}</p>
	                    </div>

	                    <p class="event__price">
	                      &euro;&nbsp;<span class="event__price-value">${item.price}</span>
	                    </p>
	                    ${item.offers.length ? `
	                    <h4 class="visually-hidden">Offers:</h4>
	                    <ul class="event__selected-offers">
	                    	${item.offers.map((offer) => `
	                      <li class="event__offer">
	                        <span class="event__offer-title">${offer.title}</span>
	                        &plus;
	                        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
	                       </li>`).join(`\n`)}
	                    </ul>` : ``}

	                    <button class="event__rollup-btn" type="button">
	                      <span class="visually-hidden">Open event</span>
	                    </button>
	                  </div>
	                </li>`).join(`\n`)}
	              </ul>
`;

const createForm = (date) => `
				<form class="event  event--edit" action="#" method="post">
                    <header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Transfer</legend>

                            <div class="event__type-item">
                              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                            </div>
                          </fieldset>

                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Activity</legend>

                            <div class="event__type-item">
                              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                            </div>

                            <div class="event__type-item">
                              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                            </div>
                          </fieldset>
                        </div>
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          Sightseeing at
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Saint Petersburg" list="destination-list-1">
                        <datalist id="destination-list-1">
                          <option value="Amsterdam"></option>
                          <option value="Geneva"></option>
                          <option value="Chamonix"></option>
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">
                          From
                        </label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">
                          To
                        </label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">Delete</button>

                      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
                      <label class="event__favorite-btn" for="event-favorite-1">
                        <span class="visually-hidden">Add to favorite</span>
                        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                        </svg>
                      </label>

                      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
                      </button>
                    </header>

                    <section class="event__details">

                      <section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                        <div class="event__available-offers">
                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
                            <label class="event__offer-label" for="event-offer-luggage-1">
                              <span class="event__offer-title">Add luggage</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">30</span>
                            </label>
                          </div>

                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
                            <label class="event__offer-label" for="event-offer-comfort-1">
                              <span class="event__offer-title">Switch to comfort class</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">100</span>
                            </label>
                          </div>

                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
                            <label class="event__offer-label" for="event-offer-meal-1">
                              <span class="event__offer-title">Add meal</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">15</span>
                            </label>
                          </div>

                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
                            <label class="event__offer-label" for="event-offer-seats-1">
                              <span class="event__offer-title">Choose seats</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">5</span>
                            </label>
                          </div>

                          <div class="event__offer-selector">
                            <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
                            <label class="event__offer-label" for="event-offer-train-1">
                              <span class="event__offer-title">Travel by train</span>
                              &plus;
                              &euro;&nbsp;<span class="event__offer-price">40</span>
                            </label>
                          </div>
                        </div>
                      </section>

                      <section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>

                        <div class="event__photos-container">
                          <div class="event__photos-tape">
                            <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
                            <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
                            <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
                            <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
                            <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
                          </div>
                        </div>
                      </section>
                    </section>
                  </form>`;

const renderIndex = () => {
  const tripMainElement = document.querySelector(`.trip-main`);
  const tripEventsElement = document.querySelector(`.trip-events h2`);
  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
  const tripControlElements = tripMainElement.querySelectorAll(`.trip-controls h2`);

  render(tripInfoElement, createTrip(tripList, dateList), 'afterbegin');
  render(tripControlElements[0], createMenu(), 'afterend');
  render(tripControlElements[1], createFilter(filterList), 'afterend');
  render(tripEventsElement, `${createSort()}\n${createTripDays(tripDayList)}`, 'afterend');
}

renderIndex()
