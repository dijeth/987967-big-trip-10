import { RenderPosition, renderComponent, replaceComponent, removeComponent } from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import { EventViewMode } from '../const.js';

export default class EventController {
  constructor(container, dataChangeHandler, viewChangeHandler, mode = EventViewMode.DEFAULT) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);

    this._mode = EventViewMode.DEFAULT;
  }

  _eventToEdit() {
    this._viewChangeHandler();

    this._mode = EventViewMode.EDITING;
    replaceComponent(this._eventEditComponent, this._eventComponent);

    document.addEventListener(`keydown`, this._documentKeyDownHandler);
  }

  _editToEvent() {
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    
    this._mode = EventViewMode.DEFAULT;

    replaceComponent(this._eventComponent, this._eventEditComponent);
    this._eventEditComponent.reset();
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
    });

    eventEditComponent.setRollupButtonClickHandler(() => {
      this._editToEvent();
    });

    eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);

      this._dataChangeHandler(eventData.id, eventEditComponent.getData());
    });

    eventEditComponent.setInputFavoriteChangeHandler(() => {
      if (this._mode === EventViewMode.ADDING) {
        return
      };

      const keepInEditing = true;

      this._dataChangeHandler(eventData.id, Object.assign({}, eventData, { isFavorite: !eventData.isFavorite }), keepInEditing);
    });

    eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();

      if (this._mode === EventViewMode.ADDING) {
        return
      };

      this._dataChangeHandler(eventData.id, null);
    });

    if (this._eventEditComponent || this._eventComponent) {
      switch (this._mode) {
        case EventViewMode.EDITING:
          replaceComponent(eventEditComponent, this._eventEditComponent);
          this._eventComponent = eventComponent;
          this._eventEditComponent = eventEditComponent;

          if (mode !== this._mode) {
            this._editToEvent();
          };

          break;

        case EventViewMode.DEFAULT:
          replaceComponent(eventComponent, this._eventComponent);
          this._eventComponent = eventComponent;
          this._eventEditComponent = eventEditComponent;

          if (mode !== this._mode) {
            this._eventToEdit();
          };

          break;
      }
    } else {
      this._eventComponent = eventComponent;
      this._eventEditComponent = eventEditComponent;

      renderComponent(this._container, RenderPosition.BEFORE_END, this._eventComponent);

      if (mode === EventViewMode.ADDING || mode === EventViewMode.EDITING) {
        this._eventToEdit();
      }
    }





    // const { newComponent, oldComponent } = mode === EventViewMode.EDITING ? { newComponent: eventEditComponent, oldComponent: this._eventEditComponent } : { newComponent: eventComponent, oldComponent: this._eventComponent };

    // if (oldComponent === null) {
    //   renderComponent(this._container, RenderPosition.BEFORE_END, newComponent);
    // } else {
    //   replaceComponent(newComponent, oldComponent);
    // }

    // this._eventComponent = eventComponent;
    // this._eventEditComponent = eventEditComponent;

    return this;
  }

  destroy() {
    removeComponent(this._eventComponent);
    removeComponent(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
  }
}
