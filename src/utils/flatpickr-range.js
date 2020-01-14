import '../../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import moment from 'moment';
import { getDateRange, getDateTime } from './common.js';
import { showErrorMessage } from './render.js';
import { ValidityError } from '../const.js';

export default class FlatpickrRange {
  constructor(inputStart, inputFinish, dateStart, dateFinish, disabledRanges, dateChangeHandler) {

    this._inputStart = inputStart;
    this._inputFinish = inputFinish;
    this._dateStart = dateStart;
    this._dateFinish = dateFinish;
    this._dateChangeHandler = dateChangeHandler;

    this._disabledRanges = disabledRanges;
    this._disabledDates = this._getDisabledDates(disabledRanges);

    this._startFlatpickr = this._createFlatpickr(
      this._inputStart,
      this._dateStart,
      this._disabledDates
    );

    this._finishFlatpickr = this._createFlatpickr(
      this._inputFinish,
      this._dateFinish,
      this._disabledDates
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

  _createFlatpickr(inputElement, defaultDate, disabledDates) {
    const config = {
      dateFormat: `y/m/d H:i`,
      enableTime: true,
      [`time_24hr`]: true,
      defaultDate,
      disable: disabledDates,
      onChange: () => {
        this._validityMessages = this._dateChangeHandler(this._startFlatpickr.selectedDates[0], this._finishFlatpickr.selectedDates[0]);
      }
    };

    return flatpickr(inputElement, config);
  }
}
