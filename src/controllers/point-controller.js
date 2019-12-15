import {RenderPosition, renderComponent, replaceComponent} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

export const PointEventMode = {
  DEFAULT: `event`,
  EDITING: `event-edit`
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);

    this._mode = PointEventMode.DEFAULT;
  }

  _eventToEdit() {
    this._onViewChange();

    this._mode = PointEventMode.EDITING;
    replaceComponent(this._eventEditComponent, this._eventComponent);
  }

  _editToEvent() {
    this._mode = PointEventMode.DEFAULT;
    replaceComponent(this._eventComponent, this._eventEditComponent);
  }

  _documentKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    }
  }

  setDefaultView() {
    if (this._mode !== PointEventMode.DEFAULT) {
      this._editToEvent();
    }
  }

  render(eventData, mode = PointEventMode.DEFAULT) {

    const eventComponent = new EventComponent(eventData);
    const eventEditComponent = new EventEditComponent(eventData);

    eventComponent.setRollupButtonClickHandler(() => {
      this._eventToEdit();
      document.addEventListener(`keydown`, this._documentKeyDownHandler);
    });

    eventEditComponent.setRollupButtonClickHandler(() => {
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    });

    eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    });

    eventEditComponent.setInputFavoriteChangeHandler(() => {
      this._onDataChange(this,
          eventData,
          Object.assign({}, eventData, {isFavorite: !eventData.isFavorite}),
          PointEventMode.EDITING);
    });

    const {newComponent, oldComponent} = mode === PointEventMode.EDITING ? {newComponent: eventEditComponent, oldComponent: this._eventEditComponent} : {newComponent: eventComponent, oldComponent: this._eventComponent};

    if (oldComponent === null) {
      renderComponent(this._container, RenderPosition.BEFORE_END, newComponent);
    } else {
      replaceComponent(newComponent, oldComponent);
    }

    this._eventComponent = eventComponent;
    this._eventEditComponent = eventEditComponent;

    return this;
  }
}
