export default class Offers {
  constructor(data) {
    data.forEach((it) => {
      this[it.type] = it.offers;
    });
  }
}
