import AbstractComponent from './abstract-component.js';

export const menuList = [
  {name: `Table`, href: `#`, active: true},
  {name: `Stats`, href: `#`, active: false}
];

const createMenuItemHtml = (menuItem) => `              
<a class="trip-tabs__btn${menuItem.active ? `  trip-tabs__btn--active` : ``}" href="${menuItem.href}">${menuItem.name}</a>`;

const createMenuHtml = (menuItems) => {
  const menuItemList = menuItems.map((item) => createMenuItemHtml(item)).join(`\n`);
  return `
              <nav class="trip-controls__trip-tabs  trip-tabs">${menuItemList}</nav>`;
};

export default class MenuComponent extends AbstractComponent {
  constructor(menuItems) {
    super();
    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuHtml(this._menuItems);
  }
}
