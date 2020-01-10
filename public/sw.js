const CACHE_PREFIX = `big-trip-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/bundle.js`,
        `/css/style.css`,
        `/img/logo.png`,
        `/img/header-bg.png`,
        `/img/header-bg@2x.png`,
        `/img/icons/taxi.png`,
        `/img/icons/bus.png`,
        `/img/icons/train.png`,
        `/img/icons/ship.png`,
        `/img/icons/transport.png`,
        `/img/icons/drive.png`,
        `/img/icons/flight.png`,
        `/img/icons/check-in.png`,
        `/img/icons/sightseeing.png`,
        `/img/icons/restaurant.png`
      ]);
    })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
    // Получаем все названия кэшей
    caches.keys()
    .then(
      // Перебираем их и составляем набор промисов на удаление
      (keys) => {
        console.log(keys);
        Promise.all(
          keys.map(
            (key) => {
              // Удаляем только те кэши,
              // которые начинаются с нашего префикса,
              // но не совпадают по версии
              if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                return caches.delete(key);
              }

              // Остальные не обрабатываем
              return null;
            }
          ).filter(
            (key) => key !== null
          )
        )
      }
    )
  );
});

const fetchHandler = (evt) => {
  const { request } = evt;

  evt.respondWith(
    caches.match(request)
    .then((cacheResponse) => {
      // Если в кэше нашёлся ответ на запрос (request),
      // возвращаем его (cacheResponse) вместо запроса к серверу
      if (cacheResponse) {
        return cacheResponse;
      }

      // Если в кэше не нашёлся ответ,
      // повторно вызываем fetch
      // с тем же запросом (request),
      // и возвращаем его
      return fetch(request).then(
        (response) => {
          // Если ответа нет, или ответ со статусом отличным от 200 OK,
          // или ответ небезопасного тип (не basic), тогда просто передаём
          // ответ дальше, никак не обрабатываем
          if (!response || response.status !== 200 || response.type !== `basic`) {
            return response;
          }

          // А если ответ удовлетворяет всем условиям, клонируем его
          const clonedResponse = response.clone();

          // Копию кладём в кэш
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));

          // Оригинал передаём дальше
          return response;
        }
      );
    })
  );
};

self.addEventListener(`fetch`, fetchHandler);
