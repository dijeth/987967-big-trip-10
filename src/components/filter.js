import {createElement} from '../util.js';

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

class FilterComponent {
  constructor(filterItems) {
    this._element = null;
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createFilterHtml(this._filterItems);
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

export default FilterComponent;
