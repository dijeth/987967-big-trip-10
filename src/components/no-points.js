import AbstractComponent from './abstract-component.js';

export default class NoPointsComponent extends AbstractComponent {
	constructor() {
		super();
		this._title = `Loading...`;
	}

  getTemplate() {
    return `<p class="trip-events__msg">${this._title}</p>`;
  }

  setNoPointsMessage() {
  	this._title = `Click New Event to create your first point`;
  }
}
