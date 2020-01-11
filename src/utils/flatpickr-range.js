import '../../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import moment from 'moment';
import {getDateRange, getDateTime} from './common.js';
import {ValidityError} from '../const.js';

const showMessage = (message) => {
  return message;
};

export default class FlatpickrRange {
  constructor(inputStart, inputFinish, dateStart, dateFinish, disabledRanges, enabledRages, dateChangeHandler) {

    this._inputStart = inputStart;
    this._inputFinish = inputFinish;
    this._dateStart = dateStart;
    this._dateFinish = dateFinish;
    this._dateChangeHandler = dateChangeHandler;

    this._finishFlatpickrChangeHandler = this._finishFlatpickrChangeHandler.bind(this);
    this._startFlatpickrChangeHandler = this._startFlatpickrChangeHandler.bind(this);

    this._disabledRanges = disabledRanges;
    this._enabledRanges = enabledRages;
    this._disabledDates = this._getDisabledDates(disabledRanges);

    this._startFlatpickr = this._createFlatpickr(
        this._inputStart,
        this._dateStart,
        this._disabledDates,
        this._startFlatpickrChangeHandler
    );

    this._finishFlatpickr = this._createFlatpickr(
        this._inputFinish,
        this._dateFinish,
        this._disabledDates,
        this._finishFlatpickrChangeHandler
    );
  }

  getStartDate() {
    return this._startFlatpickr.selectedDates[0];
  }

  getFinishDate() {
    return this._finishFlatpickr.selectedDates[0];
  }

  destroy() {
    this._startFlatpickr.destroy();
    this._finishFlatpickr.destroy();

    this._startFlatpickr = null;
    this._finishFlatpickr = null;
    this._disabledRanges = null;
    this._enabledRanges = null;
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

  _createFlatpickr(inputElement, defaultDate, disabledDates, changeHandler) {
    const config = {
      dateFormat: `y/m/d H:i`,
      enableTime: true,
      [`time_24hr`]: true,
      defaultDate,
      disable: disabledDates,
      onClose: [changeHandler],
      onChange: () => {
        this._validityMessage = this._dateChangeHandler(this._startFlatpickr.selectedDates[0], this._finishFlatpickr.selectedDates[0]);
      }
    };

    return flatpickr(inputElement, config);
  }

  _flatpickrChangeHandler(dates, isChangedStart, instance) {
    if (!dates.length) {
      return;
    }

    // let changedFlatpickr = this._finishFlatpickr;
    let changedDate = `_dateFinish`;
    let dependentFlatpickr = this._startFlatpickr;
    let dependentDate = `_dateStart`;

    if (isChangedStart) {
      // changedFlatpickr = this._startFlatpickr;
      changedDate = `_dateStart`;
      dependentFlatpickr = this._finishFlatpickr;
      dependentDate = `_dateFinish`;
    }

    switch (this._validityMessage) {
      case ValidityError.DISABLED_DATE:
        const disabledRange = getDateRange(this._disabledRanges, dates[0], true);
        showMessage(`${this._validityMessage}: ${getDateTime(disabledRange.from)} - ${getDateTime(disabledRange.to)}`);
        instance.clear();
        this[changedDate] = null;
        break;

      case ValidityError.NEGATIVE_DATE_RANGE:
        showMessage(this._validityMessage);
        dependentFlatpickr.clear();
        this[dependentDate] = null;
        break;

      case ValidityError.WRONG_DATE_RANGE:
        const enabledRange = getDateRange(this._enabledRanges, dates[0], true);
        showMessage(`${this._validityMessage}: ${getDateTime(enabledRange.from)} - ${getDateTime(enabledRange.to)}`);
        dependentFlatpickr.clear();
        this[dependentDate] = null;
        break;

      default: this[changedDate] = dates[0];
    }
  }

  _finishFlatpickrChangeHandler(dates, dateStr, instance) {
    this._flatpickrChangeHandler(dates, false, instance);
  }

  _startFlatpickrChangeHandler(dates, dateStr, instance) {
    this._flatpickrChangeHandler(dates, true, instance);
  }
}
