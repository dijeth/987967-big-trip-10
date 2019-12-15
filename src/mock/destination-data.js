import {getRandomNumber, getRandomElement} from '../utils/common.js';

const TEXT_DATA = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `);

const generatePhotoList = () => {
  const photoCount = getRandomNumber(5, 1);
  const photos = [];

  for (let i = 0; i < photoCount; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

const generateDescription = () => {
  const textCount = getRandomNumber(3, 1);
  const texts = [];

  for (let i = 0; i < textCount; i++) {
    texts.push(getRandomElement(TEXT_DATA));
  }

  return `${texts.join(`. `)}.`;
};

export const destinations = [
  `Vein`,
  `Minsk`,
  `London`,
  `Birmingham`,
  `Budapest`,
  `Berlin`,
  `Barcelona`,
  `Rome`,
  `Milan`,
  `Warsaw`,
  `Moscow`,
  `St. Petersburg`,
  `Perm`,
  `Derevnya`,
  `Istanbul`,
  `Kiev`,
  `Kharkov`,
  `Odessa`,
  `Paris`,
  `Prague`,
  `Sydney`
];

export const DestinationOptions = {
  [`Vein`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Minsk`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`London`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Birmingham`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Budapest`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Berlin`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Barcelona`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Rome`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Milan`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Warsaw`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Moscow`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`St. Petersburg`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Perm`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Derevnya`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Istanbul`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Kiev`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Kharkov`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Odessa`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Paris`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Prague`]: {description: generateDescription(), photoList: generatePhotoList()},
  [`Sydney`]: {description: generateDescription(), photoList: generatePhotoList()}
};
