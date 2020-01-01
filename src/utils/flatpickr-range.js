import '../../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import MinMaxTimePlugin from '../../node_modules/flatpickr/dist/plugins/MinMaxTimePlugin.js';
import moment from 'moment';

const FlatpickrType = {
  START: `start`,
  FINISH: `finish`
};

const MIN_DATE = new Date(0);
const MAX_DATE = new Date(32535181001646);

export default class FlatpickrRange {
  constructor(inputStart, inputFinish, dateStart, dateFinish, disabledRanges) {
    this._inputStart = inputStart;
    this._inputFinish = inputFinish;
    this._dateStart = dateStart;
    this._dateFinish = dateFinish;

    this._finishFlatpickrChangeHandler = this._finishFlatpickrChangeHandler.bind(this);
    this._startFlatpickrChangeHandler = this._startFlatpickrChangeHandler.bind(this);

    this._disabledRanges = disabledRanges ? disabledRanges : [];
    this._limitTimes = disabledRanges ? this._getLimitTimes(disabledRanges) : {};
    this._disabledDates = disabledRanges ? this._getDisabledDates(disabledRanges) : [];

    this._startFlatpickr = this._createFlatpickr(
      this._inputStart,
      this._dateStart,
      this._disabledDates,
      this._limitTimes,
      this._startFlatpickrChangeHandler
    );

    this._finishFlatpickr = this._createFlatpickr(
      this._inputFinish,
      this._dateFinish,
      this._disabledDates,
      this._limitTimes,
      this._finishFlatpickrChangeHandler
    );

    this._changedInput = null;
  }

  getStartDate() {
    return this._startFlatpickr.selectedDates[0];
  }

  getFinishDate() {
    return this._finishFlatpickr.selectedDates[0];
  }

  _rerenderStart(inputStart) {
    this._startFlatpickr.destroy();
    this._inputStart = inputStart;

    switch (this._changedInput) {
      case FlatpickrType.START:
      case null:

        this._startFlatpickr = this._createFlatpickr(
          this._inputStart,
          this._dateStart,
          this._disabledDates,
          this._limitTimes,
          this._startFlatpickrChangeHandler
        );

        break;

      case FlatpickrType.FINISH:

        const finishDisabledRanges = this._getRangeByFinish();
        const finishDisabledDates = this._getDisabledDates(finishDisabledRanges);
        const finishLimitTimes = this._getLimitTimes(finishDisabledRanges);

        this._startFlatpickr.destroy();
        this._startFlatpickr = this._createFlatpickr(
          this._inputStart,
          this._dateStart,
          finishDisabledDates,
          finishLimitTimes,
          this._startFlatpickrChangeHandler
        );

        break;
    }
  }

  _rerenderFinish(inputFinish) {
    this._finishFlatpickr.destroy();
    this._inputFinish = inputFinish;

    switch (this._changedInput) {
      case FlatpickrType.FINISH:
      case null:

        this._finishFlatpickr = this._createFlatpickr(
          this._inputFinish,
          this._dateFinish,
          this._disabledDates,
          this._limitTimes,
          this._finishFlatpickrChangeHandler
        );

        break;

      case FlatpickrType.START:

        const startDisabledRanges = this._getRangeByStart();
        const startDisabledDates = this._getDisabledDates(startDisabledRanges)
        const startLimitTimes = this._getLimitTimes(startDisabledRanges);

        this._finishFlatpickr.destroy();
        this._finishFlatpickr = this._createFlatpickr(
          this._inputFinish,
          this._dateFinish,
          startDisabledDates,
          startLimitTimes,
          this._finishFlatpickrChangeHandler
        );

        break;
    }
  }

  rerender(inputStart, inputFinish) {
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
        })
      }
    });

    return disabledDates;
  }

  _getLimitTimes(disabledRanges) {
    const limitTimes = {};

    disabledRanges.forEach((it) => {
      limitTimes[moment(it.from).format(`YYYY-MM-DD`)] = {
        minTime: `00:00`,
        maxTime: moment(it.from).format(`hh:mm`)
      };

      limitTimes[moment(it.to).format(`YYYY-MM-DD`)] = {
        minTime: moment(it.to).format(`hh:mm`),
        maxTime: `23:59`
      };
    });

    return limitTimes;
  }

  _createFlatpickr(inputElement, defaultDate, disabledDates, limitTimes, changeHandler) {
    const config = {
      dateFormat: `y/m/d H:i`,
      enableTime: true,
      [`time_24hr`]: true,
      defaultDate: defaultDate,
      disable: disabledDates,
      onChange: changeHandler,
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
        return (+this._dateFinish - a.to) - (+this._dateFinish - b.to)
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
        return (+a.from - this._dateStart) - (+b.from - this._dateStart)
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

  _finishFlatpickrChangeHandler(dates) {
    switch (this._changedInput) {
      case null:
        this._changedInput = FlatpickrType.FINISH
        break;

      case FlatpickrType.START:
        this._changedInput = null
        break;
    }

    this._dateFinish = dates[0];

    this._rerenderStart(this._inputStart);
  }

  _startFlatpickrChangeHandler(dates) {
    switch (this._changedInput) {
      case null:
        this._changedInput = FlatpickrType.START
        break;

      case FlatpickrType.FINISH:
        this._changedInput = null
        break;
    }

    this._dateStart = dates[0];

    this._rerenderFinish(this._inputFinish);
  }
}
