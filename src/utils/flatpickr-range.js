import '../../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import MinMaxTimePlugin from '../../node_modules/flatpickr/dist/plugins/MinMaxTimePlugin.js';
import moment from 'moment';
import { isDateInRanges, getDataRange, isRangesEqual } from './common.js';

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
        if (this._startFlatpickr.selectedDates.length && this._finishFlatpickr.selectedDates.length) {
          this._dateChangeHandler(this._startFlatpickr.selectedDates[0], this._finishFlatpickr.selectedDates[0])
        }
      }
    };

    return flatpickr(inputElement, config);
  }

  _flatpickrChangeHandler(dates, isChangedStart) {
    if (!dates.length) {
      return
    };

    let changedFlatpickr = this._finishFlatpickr;
    let changedDate = `_dateFinish`;
    let dependentFlatpickr = this._startFlatpickr;
    let dependentDate = `_dateStart`;
    let dateStart = dependentDate;
    let dateFinish = changedDate;

    if (isChangedStart) {
      changedFlatpickr = this._startFlatpickr;
      changedDate = `_dateStart`;
      dependentFlatpickr = this._finishFlatpickr;
      dependentDate = `_dateFinish`;
      dateStart = changedDate;
      dateFinish = dependentDate;
    };

    const enableRange = getDataRange(dates[0], this._enabledRanges);

    if (!enableRange) {
      const disableRange = getDataRange(dates[0], this._disabledRanges);

      alert(`Интервал даты с ${moment(disableRange.from).format(`LLL`)} до ${moment(disableRange.to).format(`LLL`)} занят другим событием`);
      changedFlatpickr.clear();
      this[changedDate] = null;

    } else {

      this[changedDate] = dates[0];

      if (this[dependentDate]) {
        const enableRangeDependent = getDataRange(this[dependentDate], this._enabledRanges);
        let isDateError = false;

        switch (true) {
          case isRangesEqual(enableRange, enableRangeDependent) === false:
            alert(`Начало и окончания события должны принадлежать одному доступному интервалу (с ${moment(enableRange.from).format(`LLL`)} до ${moment(enableRange.to).format(`LLL`)})`);
            isDateError = true;
            break;

          case +this[dateFinish] - this[dateStart] <= 0:
            alert(`Начало события должно быть раньше окончания`);
            isDateError = true;
            break;
        };

        if (isDateError) {
          dependentFlatpickr.clear();
          this[dependentDate] = null;
        };
      }
    };

    this._dateChangeHandler(this._dateStart, this._dateFinish);
  }

  _finishFlatpickrChangeHandler(dates) {
    this._flatpickrChangeHandler(dates, false)
  }

  _startFlatpickrChangeHandler(dates) {
    this._flatpickrChangeHandler(dates, true)
  }
}
