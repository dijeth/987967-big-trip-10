import AbstractComponent from './abstract-component.js';
import {getShortDate, getDateTime} from '../utils/common.js';

export default class DayComponent extends AbstractComponent {
  constructor(dayItem) {
    super();
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
}
