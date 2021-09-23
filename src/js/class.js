import refs from './refs'
const { searchForm, widgetContainer, city, temp, icon, description, humidity, wind } = refs
// console.log(searchForm, widgetContainer, city, temp, icon, description, humidity, wind)

let API_key = `5c718815509f60d89951c1e42379a22b`
let cityName = 'Kyiv' //строка ввода запроса

searchForm.addEventListener('submit', e => {
  e.preventDefault()
  console.log(e.target.elements.search.value) //введенное значение
  cityName = e.target.elements.search.value
  // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`
  //   проверка отправки формы, если ввели данные отправляем-делаем запрос, если нет - alert и не отправляем,лишние запросы не уходят
  cityName
    ? fetch(url) // запрос-респонс-данные
        .then(r => r.json())
        .then(d => {
          console.log(d)

          // сохранить данные в локалсторедж
          localStorage.setItem('wetherData', JSON.stringify(d))
          renderWeatherData(d)
        })
    : alert(`Введите данные!`)
  searchForm.reset() //зачистка формы
})
// console.log(JSON.parse(localStorage.getItem('wetherData'))) //розпарсеное значение wetherData или d сохраненное в локалсторедж
let weatherdataFromLS = JSON.parse(localStorage.getItem('wetherData'))
renderWeatherData(weatherdataFromLS) //вызов функции отрисовки погоды

// отрисовка погоды
function renderWeatherData(obj) {
  const {
    name,
    main: { temp: t, humidity: h },
    weather,
    wind: { speed },
  } = obj
  widgetContainer.classList.remove('loading') //удаление стилей класа loading
  city.textContent = `Weather in ${name}`
  temp.textContent = `${Math.round(t - 273.15)}°C`
  icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather[0].icon}.png`)
  icon.setAttribute('alt', weather[0].description)
  description.textContent = weather[0].description
  humidity.textContent = `Humidity: ${h}%`
  wind.textContent = `Wind speed: ${speed} km/h`
}
