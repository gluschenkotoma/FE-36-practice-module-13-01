import axios from 'axios' //npm + import
import template from '../templates/template.handlebars'
import refs from './refs'
// console.log(template)

console.dir(axios)
let BASE_URL = `https://api.openweathermap.org/data/2.5/weather` //хранение базового урла в библиотеке
axios.defaults.baseURL = BASE_URL
console.log(axios.defaults.baseURL)

const { searchContainer, searchForm, widgetContainer, city, temp, icon, description, humidity, wind } = refs
// console.log(searchForm, widgetContainer, city, temp, icon, description, humidity, wind)

let API_key = `5c718815509f60d89951c1e42379a22b`
let cityName = 'Kyiv' //строка ввода запроса

class WeatherWidget {
  // cвойства
  constructor(baseUrl, apiKey, formRef, searchInput, templateFunc, insertContainer) {
    this.baseUrl = baseUrl //адрес
    this.apiKey = apiKey //ключ доступа
    this.formRef = formRef //форма которая слушается
    this.searchInput = searchInput // инпут у которого берется значение
    this._cityName = 'Kyiv'
    this.templateFunc = templateFunc //шаблон по которому отрисовывается полученый результат
    this.insertContainer = insertContainer //место где встаивается отрисованый результат
  }
  // ПЕРЕСВОЙСТВА
  // показать и перезаписать значения инпута
  get cityName() {
    return this._cityName //берет показывает текущее значение
  }
  set cityName(value) {
    return (this._cityName = value) //перезаписывает value полученое при вызове сеттэра
  }

  // МЕТОДЫ
  // взять value с инпута
  getSearchValue() {
    this.insertContainer.insertAdjacentHTML('beforeend', '') //перед каждым запросом почистить insertContainer
    //(ссылка на форму ,ID инпута(HTML)  )
    this.formRef.addEventListener('submit', e => {
      e.preventDefault()
      console.log(e.target.elements[this.searchInput].value) //inputID -всегда разный, поэтому[]
      this.cityName = e.target.elements[this.searchInput].value //вызов сэттэра cityName, тоесть перезаписать значение
    })
  }
  // запросс
  async getFetch() {
    let params = `?q=${this.cityName}&appid=${this.apiKey}`
    try {
      let r = await axios.get(params) //аксиусу не нужен baseUrl, записали на хранение в библиотеку
      console.log(r.data) //аксиос данные(в джейсон не нужно обрабатывать )
      localStorage.setItem('wetherData', JSON.stringify(r.data))
      this.renderData(r.data)
    } catch (err) {
      console.log(err)
    }

    // 2  отправка запроса, получение данных
    // try {
    //   let r = await fetch(url)
    //   let d = await r.json()
    //   localStorage.setItem('wetherData', JSON.stringify(d))
    //   this.renderData(d)
    // } catch (err) {
    //   console.log(err)
    //   }

    // 1  отправка запроса, получение данных
    // fetch(url)
    //   .then(r => r.json())
    //   .then(d => {
    //     console.log(d)
    //     //   сохранение данніх в локалсторедж
    //     localStorage.setItem('wetherData', JSON.stringify(d))
    //     //   отрендерить
    //     renderData(d)
    //   })
    //   .catch(e => console.log(e))
  }

  //метод вызова шаблона
  // при обновлении браузера слетают данные, поэтому renderData вызывается за пределами getFetch
  renderData(obj = null) {
    //   если прилетел обьект через параметр - создаем разметку по этому обьекту и встраиваем
    if (obj) {
      let markup = this.templateFunc(obj)
      this.insertContainer.insertAjacentHTML('beforeend', markup)
    } else {
      //в противном случае если getFetch не случился, обьект не пришел, берем из локал сторедж даные и отрисовыаем
      let weatherdataFromLS = JSON.parse(localStorage.getItem('wetherData'))
      let markup = this.templateFunc(weatherdataFromLS)
      this.insertContainer.insertAdjacentHTML('beforeend', markup)
    }
  }
  //запрос на постоянной основе
  showWidget() {
    this.getFetch()
    this.renderData()
  }

  // чистка слушателей, скрыть блок widgetContainer
  hideWidget() {}
}

// экземпляр класса WeatherWidget
const newWeatherWidget = new WeatherWidget(BASE_URL, API_key, searchForm, `search`, template, searchContainer) //аргументы которые передаются в конструктор
console.log(newWeatherWidget)

newWeatherWidget.showWidget()

//
///////////////////
// searchForm.addEventListener('submit', e => {
//   e.preventDefault()
//   console.log(e.target.elements.search.value) //введенное значение
//   cityName = e.target.elements.search.value
//   // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//   let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}`
//   //   проверка отправки формы, если ввели данные отправляем-делаем запрос, если нет - alert и не отправляем,лишние запросы не уходят
//   cityName
//     ? fetch(url) // запрос-респонс-данные
//         .then(r => r.json())
//         .then(d => {
//           console.log(d)

//           // сохранить данные в локалсторедж
//           localStorage.setItem('wetherData', JSON.stringify(d))
//           renderWeatherData(d)
//         })
//     : alert(`Введите данные!`)
//   searchForm.reset() //зачистка формы
// })
// // console.log(JSON.parse(localStorage.getItem('wetherData'))) //розпарсеное значение wetherData или d сохраненное в локалсторедж
// let weatherdataFromLS = JSON.parse(localStorage.getItem('wetherData'))
// renderWeatherData(weatherdataFromLS) //вызов функции отрисовки погоды

// // отрисовка погоды
// function renderWeatherData(obj) {
//   const {
//     name,
//     main: { temp: t, humidity: h },
//     weather,
//     wind: { speed },
//   } = obj
//   widgetContainer.classList.remove('loading') //удаление стилей класа loading
//   city.textContent = `Weather in ${name}`
//   temp.textContent = `${Math.round(t - 273.15)}°C`
//   icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather[0].icon}.png`)
//   icon.setAttribute('alt', weather[0].description)
//   description.textContent = weather[0].description
//   humidity.textContent = `Humidity: ${h}%`
//   wind.textContent = `Wind speed: ${speed} km/h`
// }
