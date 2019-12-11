import { RenderElementPosition, renderElement, getDaysCount } from '../util.js';
import { replaceComponent } from '../utils/render.js';
import DayListComponent from '../components/day-list.js';
import SortComponent, { sortList } from '../components/sort.js';
import NoPointsComponent, { NO_POINTS_TEXT } from '../components/no-points.js';
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

    days.push({ dayDate: dayDate, dayCounter: dayCounter, dayEvents: dayEvents });
    dayCounter += daysCount;
    dayDate = eventList[i].start;
    dayEvents = [eventList[i]];
  }

  if (dayEvents.length) {
    days.push({ dayDate: dayDate, dayCounter: dayCounter, dayEvents: dayEvents });
  }

  return days;
};

const renderEvent = (eventData) => {
  const eventToEdit = () => replaceComponent(eventEditComponent, eventComponent);
  const editToEvent = () => replaceComponent(eventComponent, eventEditComponent);
  const documentKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      editToEvent();
      document.removeEventListener(`keydown`, documentKeyDownHandler);
    }
  };

  const eventComponent = new EventComponent(eventData);
  const eventElement = eventComponent.getElement();

  const eventEditComponent = new EventEditComponent(eventData);
  const eventEditElement = eventEditComponent.getElement();

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
};

const renderEvents = (container, eventList) => {
  const eventElements = eventList.map((it) => renderEvent(it).getElement());
  renderElement(container.getElement(), RenderElementPosition.BEFORE_END, ...eventElements);
}

export default class TripController {
  constructor(container, eventList) {
    this._container = container;
    this._eventList = eventList;
    this._sortComponent = new SortComponent(sortList)
    this._dayListComponent = new DayListComponent()
  }

  render() {
    if (this._eventList.length) {
      const days = splitEventsByDay(this._eventList);

      days.forEach((it) => {
        const dayComponent = new DayComponent(it);
        const dayEventListComponent = new EventListComponent();

        renderElement(this._dayListComponent.getElement(), RenderElementPosition.BEFORE_END, dayComponent.getElement());
        renderElement(dayComponent.getElement(), RenderElementPosition.BEFORE_END, dayEventListComponent.getElement());

        renderEvents(dayEventListComponent, it.dayEvents);
      });

      renderElement(this._container, RenderElementPosition.BEFORE_END, this._sortComponent.getElement());
      renderElement(this._container, RenderElementPosition.BEFORE_END, this._dayListComponent.getElement());
    } else {
      renderElement(this._container, RenderElementPosition.BEFORE_END, new NoPointsComponent(NO_POINTS_TEXT).getElement());
    };
  }
}
