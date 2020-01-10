export const OfferType = {
  LUGGAGE: `luggage`,
  COMFORT: `comfort`,
  MEAL: `meal`,
  SEATS: `seats`,
  TRAIN: `train`
};

export const OfferTypeOptions = {
  [OfferType.LUGGAGE]: {
    name: `Add luggage`
  },

  [OfferType.COMFORT]: {
    name: `Switch to comfort class`
  },

  [OfferType.MEAL]: {
    name: `Add meal`
  },

  [OfferType.SEATS]: {
    name: `Choose seats`
  },

  [OfferType.TRAIN]: {
    name: `Travel by train`
  }
};

export const MovingType = {
  MOVING: `Moving`,
  STAYING: `Staying`
};

export const PlaceholderParticle = {
  [MovingType.MOVING]: `to`,
  [MovingType.STAYING]: `in`
};

export const EventType = {
  'TAXI': `taxi`,
  'BUS': `bus`,
  'TRAIN': `train`,
  'SHIP': `ship`,
  'TRANSPORT': `transport`,
  'DRIVE': `drive`,
  'FLIGHT': `flight`,
  'CHECK-IN': `check-in`,
  'SIGHTSEEING': `sightseeing`,
  'RESTAURANT': `restaurant`
};

export const EventTypeProperties = {
  [EventType.TAXI]: {
    name: `Taxi`,
    icon: `taxi.png`,
    movingType: MovingType.MOVING
  },

  [EventType.BUS]: {
    name: `Bus`,
    icon: `bus.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.SEATS
    ])
  },

  [EventType.TRAIN]: {
    name: `Train`,
    icon: `train.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.LUGGAGE,
      OfferType.COMFORT,
      OfferType.MEAL
    ])
  },

  [EventType.SHIP]: {
    name: `Ship`,
    icon: `ship.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.LUGGAGE,
      OfferType.COMFORT,
      OfferType.MEAL,
      OfferType.SEATS
    ])
  },

  [EventType.TRANSPORT]: {
    name: `Transport`,
    icon: `transport.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.LUGGAGE,
      OfferType.COMFORT,
      OfferType.MEAL,
      OfferType.SEATS
    ])
  },

  [EventType.DRIVE]: {
    name: `Drive`,
    icon: `drive.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.COMFORT
    ])
  },

  [EventType.FLIGHT]: {
    name: `Flight`,
    icon: `flight.png`,
    movingType: MovingType.MOVING,
    availableOfferTypes: new Set([
      OfferType.LUGGAGE,
      OfferType.COMFORT,
      OfferType.MEAL,
      OfferType.SEATS,
      OfferType.TRAIN
    ])
  },

  [EventType[`CHECK-IN`]]: {
    name: `Check-in`,
    icon: `check-in.png`,
    movingType: MovingType.STAYING,
    availableOfferTypes: new Set([
      OfferType.MEAL
    ])
  },

  [EventType.SIGHTSEEING]: {
    name: `Sightseeing`,
    icon: `sightseeing.png`,
    movingType: MovingType.STAYING
  },

  [EventType.RESTAURANT]: {
    name: `Restaurant`,
    icon: `restaurant.png`,
    movingType: MovingType.STAYING
  }
};

export const TimeValue = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
  HALF_DAY: 12 * 60 * 60 * 1000,
  DAY: 2 * 12 * 60 * 60 * 1000,
  TWO_DAYS: 2 * 2 * 12 * 60 * 60 * 1000,
  WEEK: 7 * 2 * 12 * 60 * 60 * 1000,
  TWO_WEEKS: 14 * 2 * 12 * 60 * 60 * 1000,
  MIN_DATE: new Date(0),
  MAX_DATE: new Date(32535181001646),
  MIN_TIME: `00:00`,
  MAX_TIME: `23:59`
};

export const EVENT_DEFAULT = {
  id: null,
  type: EventType.FLIGHT,
  [`date_from`]: null,
  [`date_to`]: null,
  destination: null,
  [`base_price`]: 0,
  [`is_favorite`]: false,
  offers: []
};

export const EventMode = {
  DEFAULT: `event-preview`,
  EDITING: `event-edit`,
  ADDING: `event-adding`
};

export const TripMode = {
  DEFAULT: `trip-default`,
  ADDING: `trip-append`,
  EMPTY: `trip-empty`
};

export const MenuMode = {
  TABLE: `table`,
  STATS: `stats`
};

export const MIN_EVENT_DURATION = TimeValue.HOUR;

export const ProcessingState = {
  SAVING: `Saving...`,
  DELETING: `Deleting...`,
  CHANGING_FAVORITE: `Changing favorite`
};


export const ValidityError = {
  EMPTY_DESTINATION: `Необходимо выбрать пункт назначения`,
  EMPTY_START_DATE: `Необходимо выбрать дату начала события`,
  EMPTY_FINISH_DATE: `Необходимо выбрать дату окончания события`,
  DISABLED_DATE: `Дата начала или окончания события не должны быть внутри другого события`,
  WRONG_COST_FORMAT: `Стоимость должна быть целым числом`,
  NEGATIVE_DATE_RANGE: `Дата начала события должна быть раньше даты окончания события`,
  WRONG_DATE_RANGE: `Даты начала и окончания события должны находиться внутри одного допустимого интервала`
}
