import {getRandomNumber, getRandomElement} from '../util.js';

const TEXT_DATA = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`.split(`. `);

export const generatePhotoList = () => {
  const photoCount = getRandomNumber(5, 1);
  const photos = [];

  for (let i = 0; i < photoCount; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

export const generateDescription = () => {
  const textCount = getRandomNumber(3, 1);
  const texts = [];

  for (let i = 0; i < textCount; i++) {
    texts.push(getRandomElement(TEXT_DATA));
  }

  return `${texts.join(`. `)}.`;
};
