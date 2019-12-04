const createMenuItem = (menuItem) => `              
<a class="trip-tabs__btn${menuItem.active ? `  trip-tabs__btn--active` : ``}" href="${menuItem.href}">${menuItem.name}</a>`;

const createMenu = (menuItems) => {
  const menuItemList = menuItems.map((item) => createMenuItem(item)).join(`\n`);
  return `
              <nav class="trip-controls__trip-tabs  trip-tabs">${menuItemList}</nav>`;
};

export default createMenu;
