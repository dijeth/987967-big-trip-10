import AbstractComponent from './abstract-component.js';

export const NO_POINTS_TEXT = `Click New Event to create your first point`;

export default class NoPointsComponent extends AbstractComponent {
  constructor(text) {
    super();
    this._text = text;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${this._text}</p>`;
  }
}
