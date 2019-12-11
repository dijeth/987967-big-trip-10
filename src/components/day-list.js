import AbstractComponent from './abstract-component.js';

export default class DayListComponent extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
