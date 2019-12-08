import { createElement, RenderElementPosition, renderElement, getShortDate, getDateTime } from '../util.js';
import EventListComponent from './event-list.js';

class DayComponent {
  constructor(dayItem) {
    this._element = null;
    this._dayItem = dayItem;
  }

  getTemplate() {
    const dateText = getShortDate(this._dayItem.dayDate);
    const dateTime = getDateTime(this._dayItem.dayDate);

    return `
          <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${this._dayItem.dayCounter}</span>
                <time class="day__date" datetime="${dateTime}">${dateText}</time>
              </div>
          </li>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());

      renderElement(this._element, RenderElementPosition.BEFORE_END, new EventListComponent(this._dayItem.dayEvents).getElement())
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default DayComponent;
