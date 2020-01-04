import '../../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import MinMaxTimePlugin from '../../node_modules/flatpickr/dist/plugins/MinMaxTimePlugin.js';
import moment from 'moment';

const FlatpickrMode = {
  START: `start`,
  FINISH: `finish`,
  DEFAULT: `default`
};

const MIN_DATE = new Date(0);
const MAX_DATE = new Date(32535181001646);
const MIN_TIME = `00:00`;
const MAX_TIME = `23:59`;

export default class FlatpickrRange {
  constructor(inputStart, inputFinish, dateStart, dateFinish, disabledRanges) {

    this._inputStart = inputStart;
    this._inputFinish = inputFinish;
    this._dateStart = dateStart;
    this._dateFinish = dateFinish;

    this._finishFlatpickrCloseHandler = this._finishFlatpickrCloseHandler.bind(this);
    this._startFlatpickrCloseHandler = this._startFlatpickrCloseHandler.bind(this);

    this._disabledRanges = disabledRanges ? disabledRanges : [];
    this._limitTimes = disabledRanges ? this._getLimitTimes(disabledRanges) : {};
    this._disabledDates = disabledRanges ? this._getDisabledDates(disabledRanges) : [];

    this._startFlatpickr = this._createFlatpickr(
        this._inputStart,
        this._dateStart,
        this._disabledDates,
        this._limitTimes,
        this._startFlatpickrCloseHandler
    );

    this._finishFlatpickr = this._createFlatpickr(
        this._inputFinish,
        this._dateFinish,
        this._disabledDates,
        this._limitTimes,
        this._finishFlatpickrCloseHandler
    );

    this._flatpickrMode = FlatpickrMode.DEFAULT;
  }

  getStartDate() {
    return this._startFlatpickr.selectedDates[0];
  }

  getFinishDate() {
    return this._finishFlatpickr.selectedDates[0];
  }

  rerender(inputStart, inputFinish) {
    inputStart = inputStart || this._inputStart;
    inputFinish = inputFinish || this._inputFinish;

    this._rerenderStart(inputStart);
    this._rerenderFinish(inputFinish);
  }

  destroy() {
    this._startFlatpickr.destroy();
    this._finishFlatpickr.destroy();

    this._startFlatpickr = null;
    this._finishFlatpickr = null;
    this._disabledRanges = null;
    this._limitTimes = null;
    this._disabledDates = null;
  }

  _getDisabledDates(disabledRanges) {
    const disabledDates = [];

    disabledRanges.forEach((it) => {
      const start = moment(it.from).add(1, `days`).toDate();
      const finish = moment(it.to).subtract(1, `days`).toDate();

      if (+finish >= +start) {
        disabledDates.push({
          from: moment(start).startOf(`day`).toDate(),
          to: moment(finish).endOf(`day`).toDate()
        });
      }
    });

    return disabledDates;
  }

  _getLimitTimes(disabledRanges) {
    const limitTimes = {};

    disabledRanges.forEach((it) => {
      const formatedDateFrom = moment(it.from).format(`YYYY-MM-DD`);
      const formatedDateTo = moment(it.to).format(`YYYY-MM-DD`);

      limitTimes[formatedDateFrom] = limitTimes[formatedDateFrom] || {
        minTime: MIN_TIME,
        maxTime: MAX_TIME
      };

      limitTimes[formatedDateTo] = limitTimes[formatedDateTo] || {
        minTime: MIN_TIME,
        maxTime: MAX_TIME
      };

      limitTimes[formatedDateFrom].maxTime = moment(it.from).format(`H:mm`);
      limitTimes[formatedDateTo].minTime = moment(it.to).format(`H:mm`);
    });

    return limitTimes;
  }

  _createFlatpickr(inputElement, defaultDate, disabledDates, limitTimes, closeHandler) {
    const config = {
      dateFormat: `y/m/d H:i`,
      enableTime: true,
      [`time_24hr`]: true,
      defaultDate,
      disable: disabledDates,
      onClose: closeHandler,
      plugins: [
        new MinMaxTimePlugin({
          table: limitTimes
        })
      ]
    };

    return flatpickr(inputElement, config);
  }

  _getRangeByFinish() {
    const dateStartCandidates = this._disabledRanges.slice()
      .sort((a, b) => {
        return (+this._dateFinish - a.to) - (+this._dateFinish - b.to);
      })
      .filter((it) => +this._dateFinish - it.to >= 0);

    const dateStart = dateStartCandidates.length ? dateStartCandidates[0].to : MIN_DATE;

    const disabledRanges = [{
      from: MIN_DATE,
      to: dateStart
    }, {
      from: this._dateFinish,
      to: MAX_DATE
    }];

    return disabledRanges;
  }

  _getRangeByStart() {
    const dateFinishCandidates = this._disabledRanges.slice()
      .sort((a, b) => {
        return (+a.from - this._dateStart) - (+b.from - this._dateStart);
      })
      .filter((it) => +it.from - this._dateStart >= 0);

    const dateFinish = dateFinishCandidates.length ? dateFinishCandidates[0].from : MAX_DATE;

    const disabledRanges = [{
      from: MIN_DATE,
      to: this._dateStart
    }, {
      from: dateFinish,
      to: MAX_DATE
    }];

    return disabledRanges;
  }

  _finishFlatpickrCloseHandler(dates) {

    switch (this._flatpickrMode) {
      case FlatpickrMode.DEFAULT:
        this._flatpickrMode = FlatpickrMode.FINISH;
        break;

      case FlatpickrMode.START:
        this._flatpickrMode = FlatpickrMode.DEFAULT;
        break;
    }

    this._dateFinish = dates[0];

    this._rerenderStart(this._inputStart);
  }

  _startFlatpickrCloseHandler(dates) {

    switch (this._flatpickrMode) {
      case FlatpickrMode.DEFAULT:
        this._flatpickrMode = FlatpickrMode.START;
        break;

      case FlatpickrMode.FINISH:
        this._flatpickrMode = FlatpickrMode.DEFAULT;
        break;
    }

    this._dateStart = dates[0];

    this._rerenderFinish(this._inputFinish);
  }

  _rerenderStart(inputStart) {
    this._startFlatpickr.destroy();
    this._inputStart = inputStart;

    switch (this._flatpickrMode) {
      case FlatpickrMode.START:
      case FlatpickrMode.DEFAULT:

        this._startFlatpickr = this._createFlatpickr(
            this._inputStart,
            this._dateStart,
            this._disabledDates,
            this._limitTimes,
            this._startFlatpickrCloseHandler
        );

        break;

      case FlatpickrMode.FINISH:

        const finishDisabledRanges = this._getRangeByFinish();
        const finishDisabledDates = this._getDisabledDates(finishDisabledRanges);
        const finishLimitTimes = this._getLimitTimes(finishDisabledRanges);

        this._startFlatpickr.destroy();
        this._startFlatpickr = this._createFlatpickr(
            this._inputStart,
            this._dateStart,
            finishDisabledDates,
            finishLimitTimes,
            this._startFlatpickrCloseHandler
        );

        break;
    }
  }

  _rerenderFinish(inputFinish) {
    this._finishFlatpickr.destroy();
    this._inputFinish = inputFinish;

    switch (this._flatpickrMode) {
      case FlatpickrMode.FINISH:
      case FlatpickrMode.DEFAULT:

        this._finishFlatpickr = this._createFlatpickr(
            this._inputFinish,
            this._dateFinish,
            this._disabledDates,
            this._limitTimes,
            this._finishFlatpickrCloseHandler
        );

        break;

      case FlatpickrMode.START:

        const startDisabledRanges = this._getRangeByStart();
        const startDisabledDates = this._getDisabledDates(startDisabledRanges);
        const startLimitTimes = this._getLimitTimes(startDisabledRanges);

        this._finishFlatpickr.destroy();
        this._finishFlatpickr = this._createFlatpickr(
            this._inputFinish,
            this._dateFinish,
            startDisabledDates,
            startLimitTimes,
            this._finishFlatpickrCloseHandler
        );

        break;
    }
  }

  _setRange() {

    let disabledRanges;
    let disabledDates;
    let limitTimes;

    switch (this._flatpickrMode) {
      case FlatpickrMode.DEFAULT:

        this._startFlatpickr.config.disable = this._disabledDates;
        this._startFlatpickr.config.plugins = [new MinMaxTimePlugin({table: this._limitTimes})];

        this._finishFlatpickr.config.disable = this._disabledDates;
        this._finishFlatpickr.config.plugins = [new MinMaxTimePlugin({table: this._limitTimes})];

        break;

      case FlatpickrMode.FINISH:

        disabledRanges = this._getRangeByFinish();
        disabledDates = this._getDisabledDates(disabledRanges);
        limitTimes = this._getLimitTimes(disabledRanges);

        this._startFlatpickr.config.disable = disabledDates;
        this._startFlatpickr.config.plugins = [new MinMaxTimePlugin({table: limitTimes})];

        this._finishFlatpickr.config.disable = this._disabledDates;
        this._finishFlatpickr.config.plugins = [new MinMaxTimePlugin({table: this._limitTimes})];

        break;

      case FlatpickrMode.START:

        this._startFlatpickr.config.disable = this._disabledDates;
        this._startFlatpickr.config.plugins = [new MinMaxTimePlugin({table: this._limitTimes})];

        disabledRanges = this._getRangeByStart();
        disabledDates = this._getDisabledDates(disabledRanges);
        limitTimes = this._getLimitTimes(disabledRanges);

        this._finishFlatpickr.config.disable = disabledDates;
        this._finishFlatpickr.config.plugins = [new MinMaxTimePlugin({table: limitTimes})];

        break;
    }

    this._startFlatpickr.redraw();
    this._finishFlatpickr.redraw();
  }

}
