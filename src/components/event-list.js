import AbstractComponent from './abstract-component.js';

export default class EventListComponent extends AbstractComponent {
  constructor(eventList) {
    super();
    this._eventList = eventList;
  }

  getTemplate() {
    return `<ul class="trip-events__list"></ul>`;
  }
}
