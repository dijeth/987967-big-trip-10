export const MovingType = {
  MOVING: `moving`,
  STAYING: `staying`
};

export const PlaceholderParticle = {
  [MovingType.MOVING]: `to`,
  [MovingType.STAYING]: `in`
};

export const EventType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECKIN: `Check-in`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`,
  TRIP: `Trip`
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
    movingType: MovingType.MOVING
  },

  [EventType.TRAIN]: {
    name: `Train`,
    icon: `train.png`,
    movingType: MovingType.MOVING
  },

  [EventType.SHIP]: {
    name: `Ship`,
    icon: `ship.png`,
    movingType: MovingType.MOVING
  },

  [EventType.TRANSPORT]: {
    name: `Transport`,
    icon: `transport.png`,
    movingType: MovingType.MOVING
  },

  [EventType.DRIVE]: {
    name: `Drive`,
    icon: `drive.png`,
    movingType: MovingType.MOVING
  },

  [EventType.FLIGHT]: {
    name: `Flight`,
    icon: `flight.png`,
    movingType: MovingType.MOVING
  },

  [EventType.CHECKIN]: {
    name: `Check-in`,
    icon: `check-in.png`,
    movingType: MovingType.STAYING
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
  },

  [EventType.TRIP]: {
    name: `Trip`,
    icon: `trip.png`,
    movingType: MovingType.MOVING
  }
};

export const Destinations = [
  `Vein`,
  `Minsk`,
  `London`,
  `Birmingham`,
  `Budapest`,
  `Berlin`,
  `Barcelona`,
  `Rome`,
  `Milan`,
  `Warsaw`,
  `Moscow`,
  `St. Petersburg`,
  `Perm`,
  `Derevnya`,
  `Istanbul`,
  `Kiev`,
  `Kharkov`,
  `Odessa`,
  `Paris`,
  `Prague`,
  `Sydney`
];

export const Months = [
  `JAN`,
  `FEB`,
  `MAR`,
  `APR`,
  `MAY`,
  `JUN`,
  `JUL`,
  `AUG`,
  `SEP`,
  `OCT`,
  `NOV`,
  `DEC`
];

export const TimeValue = {
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
  HALF_DAY: 12 * 60 * 60 * 1000,
  DAY: 2 * 12 * 60 * 60 * 1000,
  TWO_DAYS: 2 * 2 * 12 * 60 * 60 * 1000,
  WEEK: 7 * 2 * 12 * 60 * 60 * 1000,
  TWO_WEEKS: 14 * 2 * 12 * 60 * 60 * 1000
};

export const EVENT_DEFAULT = {
  type: EventType.FLIGHT,
  start: new Date(),
  finish: new Date(Date.now() + TimeValue.DAY),
  destination: ``,
  cost: 0,
  isFavorite: false,
  offers: []
};

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
