import AbstractComponent from './abstract-component.js';

export default class NoPointsComponent extends AbstractComponent {
	constructor(title) {
		super();
		this._title = title;
	}

  getTemplate() {
    return `<p class="trip-events__msg">${this._title}</p>`;
  }
}
