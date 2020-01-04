import {createElement} from '../utils/render.js';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  removeElement() {
    this._element = null;
  }
}
