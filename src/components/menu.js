import { getShortDate, createElement } from '../util.js';

const createMenuItem = (menuItem) => `              
<a class="trip-tabs__btn${menuItem.active ? `  trip-tabs__btn--active` : ``}" href="${menuItem.href}">${menuItem.name}</a>`;

const createMenu = (menuItems) => {
  const menuItemList = menuItems.map((item) => createMenuItem(item)).join(`\n`);
  return `
              <nav class="trip-controls__trip-tabs  trip-tabs">${menuItemList}</nav>`;
};

class MenuComponent {
  constructor(menuItems) {
    this._element = null;
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenu(this._menuItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default MenuComponent;
