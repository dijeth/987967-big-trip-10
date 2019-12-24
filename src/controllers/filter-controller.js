import {FilterOptions} from '../utils/filter.js';
import {renderComponent, RenderPosition, replaceComponent} from '../utils/render.js';
import FilterComponent from '../components/filter.js';

class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filterComponent = null;
  }

  render() {
    const checkedFilterType = this._eventsModel.getFilter();
    const filterItems = Object.entries(FilterOptions).map((it) => {
      const [type, options] = it;

      return {
        type,
        name: options.name,
        checked: checkedFilterType === type
      };
    });

    const filterComponent = new FilterComponent(filterItems);

    filterComponent.setFilterChangeHandler((filterType) => {
      this._eventsModel.setFilter(filterType);
    });

    if (this._filterComponent === null) {
      renderComponent(this._container, RenderPosition.AFTER_END, filterComponent);
    } else {
      replaceComponent(filterComponent, this._filterComponent);
    }
  }
}

export default FilterController;
