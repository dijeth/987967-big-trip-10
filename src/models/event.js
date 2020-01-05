export default class EventModel {
  constructor(data, eventTypeOffers) {
    this.id = Number(data.id);
    this.type = data.type;
    this.start = new Date(data.date_from);
    this.finish = new Date(data.date_to);
    this.destination = data.destination.name;
    this.cost = data.base_price;
    this.isFavorite = data.is_favorite;
    this.offers = EventModel.joinOffers(data.offers, eventTypeOffers);
  }

  toRAW(destinations) {
    return {
      id: this.id,
      base_price: this.cost,
      date_from: this.start.toISOString(),
      date_to: this.finish.toISOString(),
      destination: destinations.find((it) => it.name === this.destination),
      is_favorite: this.isFavorite,
      offers: this.offers.filter((it) => it.checked).map((it) => {
        delete(it.checked);
        return it;
      }),
      type: this.type
    }
  }

  clone(destinations, eventTypeOffers) {
    return new EventModel(this.toRAW(destinations), eventTypeOffers);
  }

  static joinOffers(eventOffers, eventTypeOffers) {
    const eventOffersDict = {};
    const eventTypeOffersDict = {};

    eventOffers.map((it) => eventOffersDict[it.title] = { cost: it.price, checked: true });
    eventTypeOffers.map((it) => eventTypeOffersDict[it.title] = { cost: it.price, checked: false });

    const joinedEventOffers = Object.assign({}, eventTypeOffersDict, eventOffersDict);

    return Array.from(joinedEventOffers);
  }

  static parseEvents(data, offers) {
    return data.map((it) => new EventModel(it, offers[it.type]))
  }
}
