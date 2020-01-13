import {renderComponent, RenderPosition, replaceComponent, removeComponent} from '../utils/render.js';
import NoPointsComponent from '../components/no-points.js';
import {TripMode} from '../const.js';

export default class NoPointsController {
  constructor(container, tripController) {
    this._container = container;
    this._tripController = tripController;
    this._noPointsComponent = null;
    this._title = `Loading...`;

    this._tripModeChangeHandler = this._tripModeChangeHandler.bind(this);

    this._tripController.setModeChangeHandler(this._tripModeChangeHandler);
  }

  setNoPointsMessage() {
    this._title = `Click New Event to create your first point`;
  }

  render() {
    const noPointsComponent = new NoPointsComponent(this._title);

    if (this._noPointsComponent) {
      replaceComponent(noPointsComponent, this._noPointsComponent);
    } else {
      renderComponent(this._container, RenderPosition.BEFORE_END, noPointsComponent);
    }

    this._noPointsComponent = noPointsComponent;
  }

  _tripModeChangeHandler(mode) {
    if (mode === TripMode.EMPTY) {
      this.setNoPointsMessage();
      this.render();
    } else {
      removeComponent(this._noPointsComponent);
      this._noPointsComponent = null;
    }
  }
}
