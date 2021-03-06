import {RenderPosition, renderComponent, replaceComponent, removeComponent} from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {EventMode} from '../const.js';

export default class EventController {
  constructor(container, dataChangeHandler, viewChangeHandler, disabledRanges, destinations, offers, debounce) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._disabledRanges = disabledRanges;
    this._destinations = destinations;
    this._offers = offers;
    this._debounce = debounce;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);

    this._mode = EventMode.DEFAULT;

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getID() {
    return this._eventItem.id;
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

  setDestroyHandler(handler) {
    this._destroyHandler = handler;
  }

  setEventCancelHandler(handler) {
    this._eventCancelHandler = handler;
  }

  setErrorState() {
    this._eventEditComponent.setErrorState();
  }

  setState(processingState) {
    this._eventEditComponent.setState(processingState);
  }

  render(eventData, mode = EventMode.DEFAULT, cachedEventData) {
    this._eventItem = eventData.clone();

    let editEventData = cachedEventData;

    if (editEventData) {
      editEventData.isFavorite = eventData.isFavorite;
    } else {
      editEventData = eventData.clone();
    }

    const eventComponent = new EventComponent(eventData.clone());
    const eventEditComponent = new EventEditComponent(
        editEventData,
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

    eventEditComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._debounce(this._favoriteClickHandler);
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

  destroy() {
    if (this._destroyHandler) {
      this._destroyHandler();
    }

    removeComponent(this._eventComponent);
    removeComponent(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._documentKeyDownHandler);
  }

  setID(newID) {
    this._eventItem.id = newID;
    this._eventComponent.setID(newID);
    this._eventEditComponent.setID(newID);
  }

  _favoriteClickHandler() {
    if (this._mode === EventMode.ADDING) {
      return;
    }

    const keepInEditing = this._eventEditComponent.getData().clone();

    const newEventData = this._eventItem.clone();
    newEventData.isFavorite = !this._eventItem.isFavorite;

    this._dataChangeHandler(this, newEventData.id, newEventData, keepInEditing);
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
    this._eventEditComponent.reset(this._eventItem);
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
}
