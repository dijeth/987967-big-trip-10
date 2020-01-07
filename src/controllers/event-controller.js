import {RenderPosition, renderComponent, replaceComponent, removeComponent} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {EventMode} from '../const.js';

export default class EventController {
  constructor(container, dataChangeHandler, viewChangeHandler, disabledRanges, destinations, offers) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._disabledRanges = disabledRanges;
    this._destinations = destinations;
    this._offers = offers;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);

    this._mode = EventMode.DEFAULT;
  }

  _eventToEdit() {
    this._viewChangeHandler();

    this._mode = EventMode.EDITING;
    replaceComponent(this._eventEditComponent, this._eventComponent);

    document.addEventListener(`keydown`, this._documentKeyDownHandler);
  }

  _editToEvent() {
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);

    this._mode = EventMode.DEFAULT;

    replaceComponent(this._eventComponent, this._eventEditComponent);
    this._eventEditComponent.reset();
  }

  _documentKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === EventMode.ADDING) {
        this._eventCancelHandler();
      } else {
        this._editToEvent();
      }
    }
  }

  setDefaultView() {
    switch (this._mode) {
      case EventMode.ADDING:
        this._eventCancelHandler();
        break;

      case EventMode.EDITING:
        this._editToEvent();
    }
  }

  render(eventData, mode = EventMode.DEFAULT, cachedEventData) {
    const eventComponent = new EventComponent(eventData.clone());
    const eventEditComponent = new EventEditComponent(
        cachedEventData ? cachedEventData : eventData.clone(),
        this._disabledRanges,
        this._destinations,
        this._offers,
        mode
    );

    eventComponent.setRollupButtonClickHandler(() => {
      this._eventToEdit();
    });

    eventEditComponent.setRollupButtonClickHandler(() => {
      this._editToEvent();
    });

    eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);

      this._dataChangeHandler(this, eventData.id, eventEditComponent.getData());
    });

    eventEditComponent.setInputFavoriteChangeHandler(() => {
      if (this._mode === EventMode.ADDING) {
        return;
      }

      const keepInEditing = eventEditComponent.getData();

      eventData.isFavorite = !eventData.isFavorite;

      this._dataChangeHandler(this, eventData.id, eventData, keepInEditing);
    });

    eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();

      if (this._mode === EventMode.ADDING) {
        this._eventCancelHandler();
      } else {
        this._dataChangeHandler(this, eventData.id, null);
      }
    });

    if (this._eventEditComponent || this._eventComponent) {
      switch (this._mode) {
        case EventMode.EDITING:
          replaceComponent(eventEditComponent, this._eventEditComponent);
          this._eventComponent = eventComponent;
          this._eventEditComponent = eventEditComponent;

          if (mode !== this._mode) {
            this._editToEvent();
          }

          break;

        case EventMode.DEFAULT:
          replaceComponent(eventComponent, this._eventComponent);
          this._eventComponent = eventComponent;
          this._eventEditComponent = eventEditComponent;

          if (mode !== this._mode) {
            this._eventToEdit();
          }

          break;
      }
    } else {
      this._eventComponent = eventComponent;
      this._eventEditComponent = eventEditComponent;

      switch (mode) {
        case EventMode.EDITING:
          renderComponent(this._container, RenderPosition.BEFORE_END, this._eventComponent);
          this._eventToEdit();
          break;

        case EventMode.ADDING:
          this._viewChangeHandler();

          renderComponent(this._container, RenderPosition.AFTER_END, this._eventEditComponent);

          document.addEventListener(`keydown`, this._documentKeyDownHandler);
          break;

        default:
        case EventMode.DEFAULT:
          renderComponent(this._container, RenderPosition.BEFORE_END, this._eventComponent);
      }
    }

    this._mode = mode;

    return this;
  }

  setDestroyHandler(handler) {
    this._destroyHandler = handler;
  }

  setEventCancelHandler(handler) {
    this._eventCancelHandler = handler;
  }

  destroy() {
    if (this._destroyHandler) {
      this._destroyHandler();
    }

    removeComponent(this._eventComponent);
    removeComponent(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
  }

  setErrorState() {
    this._eventEditComponent.setErrorState()
  }
}
