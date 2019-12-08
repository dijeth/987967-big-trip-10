import { createElement, RenderElementPosition, renderElement } from '../util.js';
import EventComponent from './event.js';

class EventListComponent {
  constructor(eventList) {
    this._element = null;
    this._eventList = eventList;
  }

  getTemplate() {
    return `<ul class="trip-events__list"></ul>`
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());

      this._eventList.forEach((item) => {
        renderElement(this._element, RenderElementPosition.BEFORE_END, new EventComponent(item).getElement())
      })
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default EventListComponent;
