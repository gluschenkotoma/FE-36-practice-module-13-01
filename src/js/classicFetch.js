const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`
const API_KEY = `5c718815509f60d89951c1e42379a22b`

class ClassicFetch {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }
  getFetch(cityName) {
    let url = `${this.baseUrl}?q=${cityName}&apiid=${this.apiKey}`
  }
}
