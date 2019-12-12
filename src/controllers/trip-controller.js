import {getDaysCount} from '../utils/common.js';
import {RenderPosition, renderComponent, replaceComponent} from '../utils/render.js';
import DayListComponent from '../components/day-list.js';
import SortComponent, {sortList, SortType} from '../components/sort.js';
import NoPointsComponent, {NO_POINTS_TEXT} from '../components/no-points.js';
import DayComponent from '../components/day.js';
import EventListComponent from '../components/event-list.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';

const splitEventsByDay = (eventList) => {
  const days = [];
  let dayCounter = 1;
  let dayDate = eventList[0].start;
  let dayEvents = [eventList[0]];

  for (let i = 1; i < eventList.length; i++) {
    const daysCount = getDaysCount(dayDate, eventList[i].start);

    if (daysCount === 0) {
      dayEvents.push(eventList[i]);
      continue;
    }

    days.push({dayDate, dayCounter, dayEvents});
    dayCounter += daysCount;
    dayDate = eventList[i].start;
    dayEvents = [eventList[i]];
  }

  if (dayEvents.length) {
    days.push({dayDate, dayCounter, dayEvents});
  }

  return days;
};

const sortEventsByTime = (eventList) => {
  const dayCounter = ``;
  const dayDate = ``;
  const dayEvents = eventList.slice().sort((a, b) => (+a.finish - a.start) - (b.finish - b.start));

  return [{dayCounter, dayDate, dayEvents}];
};

const sortEventsByPrice = (eventList) => {
  const dayCounter = ``;
  const dayDate = ``;
  const dayEvents = eventList.slice().sort((a, b) => a.cost - b.cost);

  return [{dayCounter, dayDate, dayEvents}];
};


export default class TripController {
  constructor(container, eventList) {
    this._container = container;
    this._eventList = eventList;
    this._sortComponent = new SortComponent(sortList);
    this._dayListComponent = new DayListComponent();

    this._editingEventComponent = null;
  }

  render() {
    let sortedDays = [];

    if (this._eventList.length) {
      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        switch (sortType) {
          case SortType.TIME:
            sortedDays = sortEventsByTime(this._eventList);
            break;

          case SortType.PRICE:
            sortedDays = sortEventsByPrice(this._eventList);
            break;

          default:
          case SortType.DEFAULT:
            sortedDays = splitEventsByDay(this._eventList);
            break;
        }

        this._dayListComponent.getElement().innerHTML = ``;
        this.renderDays(this._dayListComponent.getElement(), sortedDays);
      });

      const days = splitEventsByDay(this._eventList);

      this.renderDays(this._dayListComponent.getElement(), days);

      renderComponent(this._container, RenderPosition.BEFORE_END, this._sortComponent);
      renderComponent(this._container, RenderPosition.BEFORE_END, this._dayListComponent);

    } else {
      renderComponent(this._container, RenderPosition.BEFORE_END, new NoPointsComponent(NO_POINTS_TEXT));
    }
  }

  renderEvent(eventData) {
    const editToEvent = () => {
      replaceComponent(eventComponent, eventEditComponent);
      this._editingEventComponent = null;
    };

    const eventToEdit = () => {
      if (this._editingEventComponent) {
        replaceComponent(this._editingEventComponent.eventComponent, this._editingEventComponent);
      }

      this._editingEventComponent = eventEditComponent;
      replaceComponent(eventEditComponent, eventComponent);
    };

    const documentKeyDownHandler = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        editToEvent();
        document.removeEventListener(`keydown`, documentKeyDownHandler);
      }
    };

    const eventComponent = new EventComponent(eventData);
    const eventEditComponent = new EventEditComponent(eventData, eventComponent);

    eventComponent.setRollupButtonClickHandler(() => {
      eventToEdit();
      document.addEventListener(`keydown`, documentKeyDownHandler);
    });

    eventEditComponent.setRollupButtonClickHandler(() => {
      editToEvent();
      document.removeEventListener(`keydown`, documentKeyDownHandler);
    });

    eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      editToEvent();
      document.removeEventListener(`keydown`, documentKeyDownHandler);
    });

    return eventComponent;
  }

  renderEvents(container, eventList) {
    const eventComponents = eventList.map((it) => this.renderEvent(it));
    renderComponent(container.getElement(), RenderPosition.BEFORE_END, ...eventComponents);
  }

  renderDays(container, dayList) {
    dayList.forEach((it) => {
      const dayComponent = new DayComponent(it);
      const dayEventListComponent = new EventListComponent();

      renderComponent(container, RenderPosition.BEFORE_END, dayComponent);
      renderComponent(dayComponent.getElement(), RenderPosition.BEFORE_END, dayEventListComponent);

      this.renderEvents(dayEventListComponent, it.dayEvents);
    });
  }
}
