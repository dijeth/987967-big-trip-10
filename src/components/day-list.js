import {createElement, splitEventsByDay, RenderElementPosition, renderElement} from '../util.js';
import DayComponent from './day.js';

class DayListComponent {
  constructor(eventList) {
    this._element = null;
    this._eventList = eventList;
  }

  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());

      splitEventsByDay(this._eventList).forEach((item) => {
        renderElement(this._element, RenderElementPosition.BEFORE_END, new DayComponent(item).getElement())
      })
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default DayListComponent;