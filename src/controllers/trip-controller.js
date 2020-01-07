import { RenderPosition, renderComponent, replaceComponent, removeComponent } from '../utils/render.js';
import { flatDataRanges } from '../utils/common.js';
import { SortOptions, SortType } from '../utils/sort.js';
import DayListComponent from '../components/day-list.js';
import SortComponent from '../components/sort.js';
import DayComponent from '../components/day.js';
import EventListComponent from '../components/event-list.js';
import EventController from './event-controller.js';
import { EventMode, EVENT_DEFAULT, TripMode } from '../const.js';
import EventModel from './../models/event.js';

export default class TripController {
  constructor(container, eventsModel, api) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._api = api;
    this._noPointsComponent = null;
    this._sortComponent = null;
    this._dayListComponent = null;
    this._editingEvent = null;
    this._mode = TripMode.DEFAULT;

    this._activeSortType = SortType.DEFAULT;

    this._eventControllers = [];
    this._showenEvents = [];
    this._modeChangeHandlers = [];
    this._destinations = [];
    this._offers = [];

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._modelDataChangeHandler = this._modelDataChangeHandler.bind(this);
    this._eventDestroyHandler = this._eventDestroyHandler.bind(this);
    this._newEventCancelHandler = this._newEventCancelHandler.bind(this);
    this.createEvent = this.createEvent.bind(this);

    this._eventsModel.setFilterChangeHandler(this._filterChangeHandler);
    this._eventsModel.setDataChangeHandler(this._modelDataChangeHandler);

    this._renderSort(this._activeSortType);
  }

  render() {
    this._showenEvents = this._eventsModel.get().slice();

    this._renderSort(this._activeSortType);
    this._renderEvents(this._showenEvents);
  }

  createEvent() {
    const container = this._sortComponent === null ? this._container.children[0] : this._sortComponent.getElement();

    const newEvent = new EventController(
      container,
      this._dataChangeHandler,
      this._viewChangeHandler,
      flatDataRanges(this._getDisabledRanges(this._eventsModel.get().slice(), null)),
      this._destinations,
      this._offers
    );

    newEvent.setDestroyHandler(this._eventDestroyHandler);
    newEvent.setEventCancelHandler(this._newEventCancelHandler);

    newEvent.render(new EventModel(EVENT_DEFAULT), EventMode.ADDING);

    this._eventControllers.push(newEvent);

    this._setMode(TripMode.ADDING);
  }

  setModeChangeHandler(handler) {
    this._modeChangeHandlers.push(handler);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  setOffers(offers) {
    this._offers = offers;
  }

  _renderSort(activeSortType) {
    const sortItems = Object.entries(SortOptions).map((it) => {
      const [type, options] = it;
      const { name, showDirection } = options;
      return { type, name, showDirection, checked: type === activeSortType };
    });

    const sortComponent = new SortComponent(sortItems);
    sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    if (this._sortComponent) {
      replaceComponent(sortComponent, this._sortComponent);
    } else {
      renderComponent(this._container, RenderPosition.BEFORE_END, sortComponent);
    }

    this._sortComponent = sortComponent;
  }

  _renderEvents(events) {
    if (!events.length) {
      this._setMode(TripMode.EMPTY);
      this._sortComponent.hide();
      return;
    }

    this._setMode(TripMode.DEFAULT);
    this._sortComponent.show();

    this._dayListComponent = new DayListComponent();
    const days = SortOptions[this._activeSortType].sort(this._showenEvents);

    this._eventControllers = this._renderDays(this._dayListComponent.getElement(), days);
    renderComponent(this._container, RenderPosition.BEFORE_END, this._dayListComponent);
  }

  _removeEvents() {
    this._eventControllers.forEach((it) => it.destroy());
    this._eventControllers = [];

    removeComponent(this._dayListComponent);

    if (this._noPointsComponent !== null) {
      removeComponent(this._noPointsComponent);
      this._noPointsComponent = null;
    }
  }

  _updateEvents(events) {
    this._removeEvents();
    this._renderEvents(events);
    this._editingEvent = null;
  }

  _renderDayEvents(container, eventList) {
    return eventList.map((it) => {
      const isEventEditing = this._editingEvent !== null && it.id === this._editingEvent.id;
      const mode = isEventEditing ? EventMode.EDITING : EventMode.DEFAULT;
      return new EventController(
        container,
        this._dataChangeHandler,
        this._viewChangeHandler,
        flatDataRanges(this._getDisabledRanges(this._eventsModel.get().slice(), it.start)),
        this._destinations,
        this._offers
      ).render(it, mode, this._editingEvent);
    });
  }

  _renderDays(container, dayList) {
    let eventControllers = [];

    dayList.forEach((it) => {
      const dayComponent = new DayComponent(it);
      const dayEventListComponent = new EventListComponent();

      renderComponent(container, RenderPosition.BEFORE_END, dayComponent);
      renderComponent(dayComponent.getElement(), RenderPosition.BEFORE_END, dayEventListComponent);

      eventControllers = eventControllers.concat(this._renderDayEvents(dayEventListComponent.getElement(), it.dayEvents));
    });

    return eventControllers;
  }

  _dataChangeHandler(id, newEventData, keepInEditMode) {
    this._editingEvent = keepInEditMode ? keepInEditMode : null;

    switch (true) {
      case id === null:
        this._api.createEvent(newEventData).then((data) => this._eventsModel.create(data));
        break;

      case newEventData === null:
        this._api.deleteEvent(id).then((data) => this._eventsModel.delete(id));
        break;

      default:
        this._api.updateEvent(id, newEventData).then((data) => this._eventsModel.update(id, data));
    }
  }

  _viewChangeHandler() {
    this._eventControllers.forEach((it) => {
      it.setDefaultView();
    });
  }

  _filterChangeHandler() {
    if (this._activeSortType !== SortType.DEFAULT) {
      this._activeSortType = SortType.DEFAULT;
      this._renderSort(this._activeSortType);
    }

    this._showenEvents = this._eventsModel.getFiltered().slice();
    this._updateEvents(this._showenEvents);
  }

  _sortTypeChangeHandler(activeSortType) {
    this._activeSortType = activeSortType;
    this._updateEvents(this._showenEvents);
  }

  _modelDataChangeHandler() {
    this._showenEvents = this._eventsModel.getFiltered().slice();
    this._updateEvents(this._showenEvents);
  }

  _eventDestroyHandler() {
    this._setMode(this._showenEvents.length ? TripMode.DEFAULT : TripMode.EMPTY);
  }

  _newEventCancelHandler() {
    this._eventControllers[this._eventControllers.length - 1].destroy();
    this._eventControllers.pop();
  }

  _setMode(mode) {
    if (this._mode !== mode) {
      this._mode = mode;
      this._modeChangeHandlers.forEach((it) => it(this._mode));
    }
  }

  _getDisabledRanges(eventList, eventStart) {
    const rangers = [];

    eventList.forEach((it) => {
      if (it.start !== eventStart) {
        rangers.push({
          from: it.start,
          to: it.finish
        });
      }
    });

    return rangers;
  }
}
