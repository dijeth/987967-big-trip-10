export default class EventModel {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.start = new Date(data.date_from);
    this.finish = new Date(data.date_to);
    this.destination = data.destination;
    this.cost = data.base_price;
    this.isFavorite = data.is_favorite;
    this.offers = data.offers;
  }

  toRAW() {
    return {
      id: this.id,
      [`base_price`]: this.cost,
      [`date_from`]: this.start.toISOString(),
      [`date_to`]: this.finish.toISOString(),
      destination: this.destination,
      [`is_favorite`]: this.isFavorite,
      offers: this.offers,
      type: this.type
    };
  }

  clone() {
    return new EventModel(this.toRAW());
  }

  static parseEvents(data) {
    return data.map((it) => new EventModel(it));
  }
}
