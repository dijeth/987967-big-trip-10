import {createElement} from '../util.js';

export const NO_POINTS_TEXT = `Click New Event to create your first point`;

export default class NoPointsComponent {
  constructor(text) {
    this._element = null;
    this._text = text;
  }

  getTemplate() {
    return `<p class="trip-events__msg">${this._text}</p>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
