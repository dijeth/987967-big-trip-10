import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EventTypeProperties, PlaceholderParticle, MovingType } from '../const.js';

const getChartConfig = (labels, data, title) => {
  return {

    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        label: 'MONEY',
        data: data,
        backgroundColor: `#ffffff`
      }]
    },
    options: {
      legend: {
        display: false
      },

      plugins: {
        datalabels: {
          font: {
            size: 15
          },
          color: `#000000`,
          anchor: `end`,
          offset: 20,
          align: `left`
        }
      },

      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],

        yAxes: [{
          scaleLabel: {
            labelString: title,
            display: true,
            fontSize: 20,
            fontColor: `#000000`
          },

          ticks: {
            beginAtZero: true,
            padding: 10,
            fontSize: 15,
            fontColor: `#000000`,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      }
    }

  }
}

const getTimeSpendData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const data = eventListSorted.map((it) => Math.floor(moment.duration(+it.finish - it.start).asHours()));

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

  return { data, labels, legends };
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

  return { data, labels, legends };
};

const getTransportData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const dictionary = {};

  eventListSorted.forEach((it) => {
    if (EventTypeProperties[it.type].movingType === MovingType.STAYING) {
      return
    };

    if (!dictionary[it.type]) {
      dictionary[it.type] = 0;
    };

    dictionary[it.type] += 1;
  });

  const labels = Object.keys(dictionary);
  const data = Object.values(dictionary);
  const legends = data.map((it) => `x ${it}`);

  return { data, labels, legends };
};

class StatisticsComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this.needRerender = true;
    this.dataChangeHandler = this.dataChangeHandler.bind(this);
  }

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

  render(eventList) {
    if (this.needRerender) {
      this.rerender(eventList)
    };
  }

  rerender(eventList) {
    super.rerender();

    this._resetCharts();

    this._timeSpendData = getTimeSpendData(eventList);
    this._moneyData = getMoneyData(eventList);
    this._transportData = getTransportData(eventList);

    this._moneyChart = this._renderMoneyChart();
    this._transportChart = this._renderTransportChart();
    this._timeSpendChart = this._renderTimeSpendChart();

    this.needRerender = false;
  }

  _renderMoneyChart() {
    const moneyCanvas = this.getElement().querySelector(`.statistics__chart--money`);
    return new Chart(moneyCanvas.getContext('2d'), getChartConfig(this._moneyData.labels, this._moneyData.data, `MONEY`));
  }

  _renderTransportChart() {
    const transportCanvas = this.getElement().querySelector(`.statistics__chart--transport`);
    return new Chart(transportCanvas.getContext('2d'), getChartConfig(this._transportData.labels, this._transportData.data, `TRANSPORT`));
  }

  _renderTimeSpendChart() {
    const timeSpendCanvas = this.getElement().querySelector(`.statistics__chart--time`);
    return new Chart(timeSpendCanvas.getContext('2d'), getChartConfig(this._timeSpendData.labels, this._timeSpendData.data, `TIME SPEND`));
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    };

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    };

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    };
  }

  recoveryListeners() {}

  dataChangeHandler() {
    this.needRerender = true;
  }
};

export default StatisticsComponent;
