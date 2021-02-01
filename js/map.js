const TOTAL_ADS = 8;
const ADS_OPTIONS = {
  TITLES: [
    `Большая уютная квартира`,
    `Маленькая неуютная квартира`,
    `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`,
    `Красивый гостевой домик`,
    `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`,
    `Неуютное бунгало по колено в воде`
  ],
  PRICES: {
    MIN: 1000,
    MAX: 1000000
  },
  TYPES: [
    `palace`,
    `flat`,
    `house`,
    `bungalo`
  ],
  ROOMS: {
    MIN: 1,
    MAX: 5
  },
  GUESTS: {
    MIN: 1,
    MAX: 10
  },
  TIME_OPTIONS: [
    `12:00`,
    `13:00`,
    `14:00`
  ],
  FEATURES: [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`
  ],
  PHOTOS: [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
  ],
  LOCATION: {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  }
};

// получаем случайное число в диапазоне
let getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// создаем массив аватаров
let generateAvatars = function () {
  let avatarLinks = [];
  for (let i = 0; i < TOTAL_ADS; i++) {
    let link = `img/avatars/user0${i + 1}.png`;
    avatarLinks.push(link);
  }
  return avatarLinks;
};

// получаем тип жилья в зависимости от названия
let getType = function (title) {
  let type = ``;
  switch (true) {
    case /квартира/.test(title):
      type = ADS_OPTIONS.TYPES[1];
      break;
    case /дворец/.test(title):
      type = ADS_OPTIONS.TYPES[0];
      break;
    case /домик/.test(title):
      type = ADS_OPTIONS.TYPES[2];
      break;
    default:
      type = ADS_OPTIONS.TYPES[3];
      break;
  }
  return type;
};

// создаем новый массив из случайных элементов другого массива
let fillArray = function (arr) {
  // вычисляем длину будущего массива
  let newArrayLength = Math.ceil(Math.random() * arr.length);
  // создаем будущий массив
  let newArray = [];

  while (newArray.length < newArrayLength) {
    // берем рандомный элемент первого массива
    let elem = arr[getRandomNumber(0, arr.length - 1)];

    // проверяем, есть ли элемент в массиве, если нет — добавляем
    if (newArray.includes(elem) === false) {
      newArray.push(elem);
    }
  }
  return newArray;
};

// перемешиваем массив
let shuffleArray = function (array) {
  let shuffled = array
    .map((a) => ({
      sort: Math.random(),
      value: a
    }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
  return shuffled;
};

let ads = [];

// заполняем массив объектами
let createItems = function (arr) {
  // перемешиваем массивы названий и аватаров
  let shuffledTitles = shuffleArray(ADS_OPTIONS.TITLES);
  let avatars = generateAvatars();
  let shuffledAvatars = shuffleArray(avatars);

  for (let i = 0; i < TOTAL_ADS; i++) {
    arr[i] = {};
    arr[i].author = {};
    arr[i].author.avatar = shuffledAvatars[i];
    arr[i].location = {};
    arr[i].location.x = getRandomNumber(ADS_OPTIONS.LOCATION.X.MIN, ADS_OPTIONS.LOCATION.X.MAX);
    arr[i].location.y = getRandomNumber(ADS_OPTIONS.LOCATION.Y.MIN, ADS_OPTIONS.LOCATION.Y.MAX);
    arr[i].offer = {};
    arr[i].offer.title = shuffledTitles[i];
    arr[i].offer.address = arr[i].location.x + `, ` + arr[i].location.y;
    arr[i].offer.price = getRandomNumber(ADS_OPTIONS.PRICES.MIN, ADS_OPTIONS.PRICES.MAX);
    arr[i].offer.type = getType(arr[i].offer.title);
    arr[i].offer.rooms = getRandomNumber(ADS_OPTIONS.ROOMS.MIN, ADS_OPTIONS.ROOMS.MAX);
    arr[i].offer.guests = getRandomNumber(ADS_OPTIONS.GUESTS.MIN, ADS_OPTIONS.GUESTS.MAX);
    arr[i].offer.checkin = ADS_OPTIONS.TIME_OPTIONS[getRandomNumber(0, ADS_OPTIONS.TIME_OPTIONS.length - 1)];
    arr[i].offer.checkout = ADS_OPTIONS.TIME_OPTIONS[getRandomNumber(0, ADS_OPTIONS.TIME_OPTIONS.length - 1)];
    arr[i].offer.features = fillArray(ADS_OPTIONS.FEATURES);
    arr[i].offer.description = ``;
    arr[i].offer.photos = shuffleArray(ADS_OPTIONS.PHOTOS);
  }
};

createItems(ads);

let map = document.querySelector(`.map`);
let mapPins = document.querySelector(`.map__pins`);
let mapPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
let cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
let mapFiltersContainer = document.querySelector(`.map__filters-container`);
let typesMap = {
  palace: `Дворец`,
  flat: `Квартира`,
  house: `Дом`,
  bungalo: `Бунгало`
};

// делаем видимой карту
map.classList.remove(`map--faded`);


// создаем и добавляем пины на основе темплейта
let createPins = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    let pinItem = mapPinTemplate.cloneNode(true);
    pinItem.querySelector(`img`).src = arr[i].author.avatar;
    pinItem.style.left = arr[i].location.x + `px`;
    pinItem.style.top = arr[i].location.y + `px`;
    pinItem.querySelector(`img`).alt = arr[i].offer.title;
    mapPins.appendChild(pinItem);
  }
};

createPins(ads);


// создаем список features
let createFeatures = function (arr) {
  let list = ``;
  for (let i = 0; i < arr.length; i++) {
    let listItem = `<li class="popup__feature popup__feature--${arr[i]}"></li>`;
    list += listItem;
  }
  return list;
};

// создаем список изображений
let createPhotos = function (arr) {
  let list = ``;
  for (let i = 0; i < arr.length; i++) {
    let listItem = `<img src="${arr[i]}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`;
    list += listItem;
  }
  return list;
};

// создаем и добавляем описания на основе темплейта
let createElems = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    let itemElem = cardTemplate.cloneNode(true);
    itemElem.querySelector(`.popup__title`).textContent = arr[i].offer.title;
    itemElem.querySelector(`.popup__text--address`).textContent = arr[i].offer.address;
    itemElem.querySelector(`.popup__text--price`).textContent = `${arr[i].offer.price}₽/ночь`;
    itemElem.querySelector(`.popup__type`).textContent = typesMap[arr[i].offer.type];
    itemElem.querySelector(`.popup__text--capacity`).textContent = `${arr[i].offer.rooms} комнаты для ${arr[i].offer.guests} гостей`;
    itemElem.querySelector(`.popup__text--time`).textContent = `Заезд после ${arr[i].offer.checkin}, выезд до ${arr[i].offer.checkout}`;
    itemElem.querySelector(`.popup__features`).innerHTML = createFeatures(arr[i].offer.features);
    itemElem.querySelector(`.popup__description`).textContent = arr[i].offer.description;
    itemElem.querySelector(`.popup__photos`).innerHTML = createPhotos(arr[i].offer.photos);
    itemElem.querySelector(`.popup__avatar`).src = arr[i].author.avatar;
    mapFiltersContainer.insertAdjacentElement(`beforebegin`, itemElem);
  }
};

createElems(ads);
