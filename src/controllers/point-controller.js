import { RenderPosition, renderComponent, replaceComponent } from '../utils/render.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._documentKeyDownHandler = this._documentKeyDownHandler.bind(this);
  }

  _eventToEdit() {
    replaceComponent(this._eventEditComponent, this._eventComponent)
  }

  _editToEvent() {
    replaceComponent(this._eventComponent, this._eventEditComponent)
  }

  _documentKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    }
  }

  render(eventData) {

    this._eventComponent = new EventComponent(eventData);
    this._eventEditComponent = new EventEditComponent(eventData);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._eventToEdit();
      document.addEventListener(`keydown`, this._documentKeyDownHandler);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._editToEvent();
      document.removeEventListener(`keydown`, this._documentKeyDownHandler);
    });

    renderComponent(this._container, RenderPosition.BEFORE_END, this._eventComponent);

    return this;
  };
}
