import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EventTypeProperties, PlaceholderParticle, MovingType } from '../const.js';
import { toSentenceCase } from './../utils/common.js';

const BarParameter = {
  HEIGHT: 50,
  MIN_LENGTH: 70,
  BACKGROUND_COLOR: `#ffffff`,
  TYPE: `horizontalBar`,
  PADDING: {
    left: 35,
    right: 0,
    top: 0,
    bottom: 0
  }
};

const YAxesParameter = {
  AXES_PADDING: {
    bottom: 80
  },
  TICKS_PADDING: 20,
  AXES_FONT_SIZE: 20,
  TICKS_FONT_SIZE: 15,
  AXES_FONT_COLOR: `#000000`,
  TICKS_FONT_COLOR: `#000000`
};

const DataLabelsParameter = {
  FONT_SIZE: 15,
  COLOR: `#000000`,
  OFFSET: 10,
  ANCHOR: `end`,
  ALIGN: `left`
}

const MIN_HEIGHT = 3;

const getChartConfig = (labels, data, title, generatorLabel) => {
  return {
    maintainAspectRatio: false,
    plugins: [ChartDataLabels],
    type: BarParameter.TYPE,
    data: {
      labels,
      datasets: [{
        data,
        minBarLength: BarParameter.MIN_LENGTH,
        backgroundColor: BarParameter.BACKGROUND_COLOR
      }]
    },

    options: {
      layout: {
        padding: BarParameter.PADDING
      },

      tooltips: {
        enabled: false
      },

      legend: {
        display: false
      },

      plugins: {
        datalabels: {
          formatter(value) {
            return generatorLabel(value);
          },
          font: {
            size: DataLabelsParameter.FONT_SIZE
          },
          color: DataLabelsParameter.COLOR,
          anchor: DataLabelsParameter.ANCHOR,
          offset: DataLabelsParameter.OFFSET,
          align: DataLabelsParameter.ALIGN
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
            padding: YAxesParameter.AXES_PADDING,
            labelString: title,
            display: true,
            fontSize: YAxesParameter.AXES_FONT_SIZE,
            fontColor: YAxesParameter.AXES_FONT_COLOR
          },

          ticks: {
            beginAtZero: true,
            padding: YAxesParameter.TICKS_PADDING,
            fontSize: YAxesParameter.TICKS_FONT_SIZE,
            fontColor: YAxesParameter.TICKS_FONT_COLOR,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      }
    }

  };
};

const getTimeSpendData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const data = eventListSorted.map((it) => +it.finish - it.start);

  const legends = data.map((it) => {
    let duration = Math.floor(moment.duration(it).asHours());

    if (!duration) {
      duration = `${Math.round(moment.duration(it).asMinutes())}M`;
    } else {
      duration = `${duration}H`;
    }

    return duration;
  });

  const labels = eventListSorted.map((it) => {
    const movingType = EventTypeProperties[it.type].name;
    const particle = PlaceholderParticle[EventTypeProperties[it.type].movingType];
    const destination = it.destination.name;

    return [movingType, particle, destination].join(` `);
  });

  return { data, labels, legends };
};

const getMoneyData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const dictionary = {};

  eventListSorted.forEach((it) => {
    if (!dictionary[it.type]) {
      dictionary[it.type] = 0;
    }

    dictionary[it.type] += it.cost;
  });

  const labels = Object.keys(dictionary).map((it) => toSentenceCase(it));
  const data = Object.values(dictionary);
  const legends = data.map((it) => `€ ${it}`);

  return { data, labels, legends };
};

const getTransportData = (eventList) => {
  const eventListSorted = eventList.slice().sort((a, b) => +a.start - b.start);
  const dictionary = {};

  eventListSorted.forEach((it) => {
    if (EventTypeProperties[it.type].movingType === MovingType.STAYING) {
      return;
    }

    if (!dictionary[it.type]) {
      dictionary[it.type] = 0;
    }

    dictionary[it.type] += 1;
  });

  const labels = Object.keys(dictionary).map((it) => toSentenceCase(it));
  const data = Object.values(dictionary);
  const legends = data.map((it) => `x ${it}`);

  return { data, labels, legends };
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor() {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

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
        </section>`;
  }

  render(eventList) {
    if (this.needRerender) {
      this.rerender(eventList);
    }
  }

  rerender(eventList) {
    super.rerender();

    this._resetCharts();

    this._timeSpentData = getTimeSpendData(eventList);
    this._moneyData = getMoneyData(eventList);
    this._transportData = getTransportData(eventList);

    this._moneyChart = this._renderMoneyChart();
    this._transportChart = this._renderTransportChart();
    this._timeSpentChart = this._renderTimeSpendChart();

    this.needRerender = false;
  }

  recoveryListeners() {}

  _renderMoneyChart() {
    const moneyCanvas = this.getElement().querySelector(`.statistics__chart--money`);
    moneyCanvas.height = BarParameter.HEIGHT * (MIN_HEIGHT > this._moneyData.data.length ? MIN_HEIGHT : this._moneyData.data.length);


    return new Chart(
      moneyCanvas.getContext(`2d`),
      getChartConfig(
        this._moneyData.labels,
        this._moneyData.data,
        `MONEY`,
        (value) => `€ ${value}`));
  }

  _renderTransportChart() {
    const transportCanvas = this.getElement().querySelector(`.statistics__chart--transport`);
    transportCanvas.height = BarParameter.HEIGHT * (MIN_HEIGHT > this._transportData.data.length ? MIN_HEIGHT : this._transportData.data.length);


    return new Chart(
      transportCanvas.getContext(`2d`),
      getChartConfig(
        this._transportData.labels,
        this._transportData.data,
        `TRANSPORT`,
        (value) => `x${value}`));
  }

  _renderTimeSpendChart() {
    const timeSpentCanvas = this.getElement().querySelector(`.statistics__chart--time`);
    timeSpentCanvas.height = BarParameter.HEIGHT * (MIN_HEIGHT > this._timeSpentData.data.length ? MIN_HEIGHT : this._timeSpentData.data.length);


    return new Chart(
      timeSpentCanvas.getContext(`2d`),
      getChartConfig(
        this._timeSpentData.labels,
        this._timeSpentData.data,
        `TIME SPEND`,
        (value) => {
          const hours = Math.floor(moment.duration(value).asHours());
          const minutes = Math.floor(moment.duration(value).asMinutes());
          const time = hours ? `${hours}H` : `${minutes}M`;

          return time;
        }));
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }

  dataChangeHandler() {
    this.needRerender = true;
  }
}
