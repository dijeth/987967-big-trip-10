import AbstractComponent from './abstract-component.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();

    this.removeElement();
    oldElement.replaceWith(this.getElement());

    this.recoveryListeners();
  }
}
