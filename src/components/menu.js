import AbstractComponent from './abstract-component.js';
import {MenuMode} from '../const.js';

const menuItems = [
  { name: `Table`, mode: MenuMode.TABLE },
  { name: `Stats`, mode: MenuMode.STATS }
];

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createMenuItemHtml = (menuItem, checked) => `              
<a data-mode="${menuItem.mode}" class="trip-tabs__btn${checked ? ` ${ACTIVE_CLASS}` : ``}" href="#">${menuItem.name}</a>`;

const createMenuHtml = (menuItems, mode) => {
  const menuItemList = menuItems.map((it) => createMenuItemHtml(it, it.mode === mode)).join(`\n`);
  return `
              <nav class="trip-controls__trip-tabs  trip-tabs">${menuItemList}</nav>`;
};

export default class MenuComponent extends AbstractComponent {
  constructor() {
    super();
    this._menuItems = menuItems;
    this._mode = MenuMode.TABLE;
    this._modeChangeHandler = null;

    this._addClickListener();
  }

  getTemplate() {
    return createMenuHtml(this._menuItems, this._mode);
  }

  setMode(mode) {
    if (this._mode === mode) {
      return;
    };

    this.getElement().querySelector(`.${ACTIVE_CLASS}`).classList.remove(ACTIVE_CLASS);
    this.getElement().querySelector(`[data-mode="${mode}"]`).classList.add(ACTIVE_CLASS);

    this._mode = mode;

    if (this._modeChangeHandler) {
      this._modeChangeHandler(mode)
    }
  }

  setModeChangeHandler(handler) {
    this._modeChangeHandler = handler;
  }

  _addClickListener() {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return
      };

      evt.preventDefault();
      this.setMode(evt.target.dataset.mode);
    })
  }
}
