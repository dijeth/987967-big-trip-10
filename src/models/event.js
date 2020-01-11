export default class EventModel {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.start = data.date_from ? new Date(data.date_from) : null;
    this.finish = data.date_to ? new Date(data.date_to) : null;
    this.destination = data.destination;
    this.cost = data.base_price;
    this.isFavorite = data.is_favorite;
    this.offers = data.offers;
  }

  toRAW() {
    const raw = {
      id: this.id,
      [`base_price`]: this.cost,
      [`date_from`]: this.start ? this.start.toISOString() : null,
      [`date_to`]: this.finish ? this.finish.toISOString() : null,
      destination: JSON.parse(JSON.stringify(this.destination)),
      [`is_favorite`]: this.isFavorite,
      offers: JSON.parse(JSON.stringify(this.offers)),
      type: this.type
    };

    return raw;
  }

  clone() {
    return new EventModel(this.toRAW());
  }

  static parseEvents(data) {
    return data.map((it) => new EventModel(it));
  }
}
