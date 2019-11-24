const createFilterItem = (name, checked = false) => `
              <div class="trip-filters__filter">
                <input id="filter-${name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.toLowerCase()}" ${checked ? `checked` : ``}>
                <label class="trip-filters__filter-label" for="filter-${name.toLowerCase()}">${name}</label>
              </div>`;

const createFilter = (filterNames, checkedIndex = 0) => {
  return `
	        <form class="trip-filters" action="#" method="get">
	          ${ filterNames.map((item, index) => createFilterItem(item, index === checkedIndex)).join(`\n`) }
              <button class="visually-hidden" type="submit">Accept filter</button>
            </form>`;
};

export {createFilter};
