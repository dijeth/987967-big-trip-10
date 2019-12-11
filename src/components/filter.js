import AbstractComponent from './abstract-component.js';

export const filterList = [
  {name: `Everything`, checked: true},
  {name: `Future`, checked: false},
  {name: `Past`, checked: false}
];

const createFilterItemHtml = (filterItem) => `
              <div class="trip-filters__filter">
                <input id="filter-${filterItem.name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.toLowerCase()}" ${filterItem.checked ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-${filterItem.name.toLowerCase()}">${filterItem.name}</label>
              </div>`;

const createFilterHtml = (filterItems) => {
  const filterItemsHtml = filterItems.map((item) => createFilterItemHtml(item)).join(`\n`);
  return `
          <form class="trip-filters" action="#" method="get">
            ${filterItemsHtml}
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
};

export default class FilterComponent extends AbstractComponent {
  constructor(filterItems) {
    super();
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createFilterHtml(this._filterItems);
  }
}
