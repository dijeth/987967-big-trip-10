import { RenderPosition, renderComponent, replaceComponent, removeComponent } from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

export const EventViewMode = {
  DEFAULT: `event`,
  EDITING: `event-edit`
};

export default class EventController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);

    this._mode = EventViewMode.DEFAULT;
  }

  _eventToEdit() {
    this._onViewChange();

    this._mode = EventViewMode.EDITING;
    replaceComponent(this._eventEditComponent, this._eventComponent);
  }

  _editToEvent() {
    this._mode = EventViewMode.DEFAULT;
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
    if (this._mode !== EventViewMode.DEFAULT) {
      this._editToEvent();
    }
  }

  render(eventData, mode = EventViewMode.DEFAULT) {

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
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);

      this._editToEvent();

      this._onDataChange(this, eventEditComponent.getOldData(), eventEditComponent.getData());
    });

    eventEditComponent.setInputFavoriteChangeHandler(() => {
      this._onDataChange(this,
        eventData,
        Object.assign({}, eventData, { isFavorite: !eventData.isFavorite }),
        EventViewMode.EDITING);
    });

    const { newComponent, oldComponent } = mode === EventViewMode.EDITING ? { newComponent: eventEditComponent, oldComponent: this._eventEditComponent } : { newComponent: eventComponent, oldComponent: this._eventComponent };

    if (oldComponent === null) {
      renderComponent(this._container, RenderPosition.BEFORE_END, newComponent);
    } else {
      replaceComponent(newComponent, oldComponent);
    }

    this._eventComponent = eventComponent;
    this._eventEditComponent = eventEditComponent;

    return this;
  }

  destroy() {
    removeComponent(this._eventComponent);
    removeComponent(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
  }
}
