import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';
import {EventTypeProperties, PlaceholderParticle} from '../const.js';

const getTimeSpendData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const data = eventListSorted.map((it) => +it.finish - it.start);
  const legends = data.map((it) => {
    let duration = Math.floor(moment.duration(it).asHours());

    if (!duration) {
      duration = `${Math.round(moment.duration(it).asMinutes())}M`;
    } else {
      duration = `${duration}H`;
    };

    return duration;
  });

  const labels = eventListSorted.map((it) => {
    const movingType = EventTypeProperties[it.type].movingType;
    const particle = PlaceholderParticle[movingType];
    const destination = it.destination;

    return [movingType, particle, destination].join(' ');
  });

  return {data, labels, legends};
};

const getMoneyData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const dictionary = {};

  eventListSorted.forEach((it) => {
    if (!dictionary[it.type]) {
      dictionary[it.type] = 0;
    };

    dictionary[it.type] += it.cost;
  });

  const labels = Object.keys(dictionary);
  const data = Object.values(dictionary); 
  const legends = data.map((it) => `€ ${it}`); 

  return {data, labels, legends};
};

const getTransportData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const dictionary = {};

  eventListSorted.forEach((it) => {
    if (!dictionary[it.type]) {
      dictionary[it.type] = 0;
    };

    dictionary[it.type] += 1;
  });

  const labels = Object.keys(dictionary);
  const data = Object.values(dictionary); 
  const legends = data.map((it) => `x ${it}`); 

  return {data, labels, legends};
};

class StatisticsComponent extends AbstractSmartComponent {
	getTemplate() {
		return `
				<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`
	}

  rerender(eventList) {
    super.rerender();

    this._timeSpendData = getTimeSpendData(eventList);
    this._moneyData = getMoneyData(eventList);
    this._transportData = getTransportData(eventList);

    this.getElement().querySelector(`.statistics__item--money`).append(JSON.stringify(this._moneyData));
    this.getElement().querySelector(`.statistics__item--transport`).append(JSON.stringify(this._transportData));
    this.getElement().querySelector(`.statistics__item--time-spend`).append(JSON.stringify(this._timeSpendData));
  }

  recoveryListeners() {

  }
 };

 export default StatisticsComponent;