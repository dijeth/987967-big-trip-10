export default class EventModel {
  constructor(data, eventTypeOffers) {
    this.id = data.id;
    this.type = data.type;
    this.start = new Date(data.date_from);
    this.finish = new Date(data.date_to);
    this.destination = data.destination;
    this.cost = data.base_price;
    this.isFavorite = data.is_favorite;
    this.offers = EventModel.joinOffers(data.offers, eventTypeOffers);
  }

  toRAW() {
    return {
      id: this.id,
      base_price: this.cost,
      date_from: this.start.toISOString(),
      date_to: this.finish.toISOString(),
      destination: this.destination,
      is_favorite: this.isFavorite,
      offers: this.offers.filter((it) => it.checked).map((it) => {
        const offer = Object.assign({}, it);
        delete(offer.checked);
        return offer;
      }),
      type: this.type
    }
  }

  clone() {
    const offers = this.offers.slice();
    const eventClone = new EventModel(this.toRAW(), offers);

    return eventClone;
  }

  static joinOffers(eventOffers, eventTypeOffers) {
    const eventOffersDict = {};
    const eventTypeOffersDict = {};

    eventOffers.forEach((it) => eventOffersDict[it.title] = { price: it.price, checked: true });
    eventTypeOffers.forEach((it) => eventTypeOffersDict[it.title] = { price: it.price, checked: false });

    const joinedEventOffers = Object.assign({}, eventTypeOffersDict, eventOffersDict);
    const resultOffers = Object.entries(joinedEventOffers).map((it) => Object.assign({title: it[0]}, it[1]));

    return resultOffers;
  }

  static parseEvents(data, offers) {
    return data.map((it) => new EventModel(it, offers[it.type]))
  }
}
