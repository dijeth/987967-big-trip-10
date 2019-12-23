import AbstractComponent from './abstract-component.js';

const createTripInfoHtml = (infoDates, infoTitle, infoCost) => {
  return `
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${infoTitle.join(` &mdash; `)}</h1>
              <p class="trip-info__dates">${infoDates}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${infoCost}</span>
            </p>
          </section>`;
};

export default class TripInfoComponent extends AbstractComponent {
  constructor(infoDates, infoTitle, infoCost) {
    super();
    this._infoDates = infoDates;
    this._infoTitle = infoTitle;
    this._infoCost = infoCost;
  }

  getTemplate() {
    return createTripInfoHtml(this._infoDates, this._infoTitle, this._infoCost);
  }
}
