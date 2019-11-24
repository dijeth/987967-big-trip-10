const getDateTitle = (datePoints) => `${datePoints[0]}&nbsp;&mdash;&nbsp;${datePoints[datePoints.length - 1]}`;

const createTripInfo = (tripPoints, datePoints) => {
  const shortTrip = tripPoints.length > 2 ? [tripPoints[0], `...`, tripPoints[tripPoints.length - 1]] : tripPoints;

  return `
            <div class="trip-info__main">
              <h1 class="trip-info__title">${shortTrip.join(` &mdash; `)}</h1>

              <p class="trip-info__dates">${getDateTitle(datePoints)}</p>
            </div>`;
};

export {createTripInfo};
