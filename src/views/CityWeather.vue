<template>
  <div class="w-full">
    <header class="header py-4 text-black w-full bg-slate-800">
      <div class="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
        <router-link to="/">
          <h1 class="text-3xl font-bold text-white">Weather App</h1>
        </router-link>
        <div class="search-bar flex items-center gap-5 bg-white py-1 px-2 rounded relative">
          <input
            class="outline-none w-full text-lg font-medium text-black"
            type="text"
            v-model="city"
            placeholder="Enter city name"
            @keyup="fetchSuggestions"
            @keyup.enter="navigateToCityWeather"
          />
          <button class="bg-[#8a7a1e] py-2 px-4 rounded text-white" @click="navigateToCityWeather">
            Search
          </button>
        </div>
      </div>
    </header>
    <div class="header py-4 text-black w-full bg-slate-800">
      <div class="city-weather max-w-[1200px] mx-auto px-4 py-20">
        <h1 class="text-6xl font-bold text-white">{{ cityName }} - {{ countryCode }}</h1>
        <div v-if="weather">
          <p class="pt-5 pb-3 text-white text-xl font-normal">
            Temperature: {{ weather.main.temp }}°C
          </p>
          <p class="text-white text-xl font-normal">
            Description: {{ weather.weather[0].description }}
          </p>
        </div>
      </div>
    </div>
    <h2 class="text-center text-2xl text-slate-800 py-5">5 Day Forecast</h2>
    <canvas id="weatherChart" class="max-w-7xl"></canvas>

    <!-- New Section for Wind Details and Sun/Moon Times -->
    <section
      class="max-w-[900px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-900"
    >
      <div>
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <h2 class="text-xl font-semibold text-slate-800">Current Weather</h2>
          <p class="text-lg font-semibold text-slate-800">{{ getCurrentTime }}</p>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-col md:flex-row items-center pt-10">
            <p class="text-2xl font-semibold" v-if="weather">{{ weather.main.temp }}°C</p>
          </div>
          <div class="pt-5" v-if="weather">
            <p
              class="pt-2 font-medium border-b border-slate-900 pb-2 text-base text-slate-800 flex items-center justify-between"
            >
              Wind: <span>{{ windDirection }}°</span>
            </p>
            <p
              class="py-2 font-medium text-base border-b border-slate-900 pb-2 text-slate-800 flex items-center justify-between"
            >
              Wind Speed: &nbsp;&nbsp;<span>{{ weather.wind.speed }} Km/h</span>
            </p>
            <p class="font-medium text-base text-slate-800 flex items-center justify-between">
              Wind Gust: <span>{{ weather.wind.gust }}</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <h2 class="text-xl font-semibold text-slate-800">Sun & Moon Times</h2>
        </div>
        <div class="py-6 flex justify-center gap-10 items-center">
          <p class="text-slate-800 text-xl text-center font-bold" v-if="weather">
            Sunrise: <br />
            <span class="font-medium text-base">{{ sunriseTime }}</span>
          </p>
          <p class="text-slate-800 text-xl text-center font-bold" v-if="weather">
            Sunset: <br />
            <span class="font-medium text-base">{{ sunsetTime }}</span>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto'

export default {
  props: ['cityName'],
  data() {
    return {
      city: '',
      suggestions: [],
      weather: null,
      forecast: null,
      countryCode: '',
      sunriseTime: '',
      sunsetTime: '',
      windDirection: ''
    }
  },
  computed: {
    getCurrentTime() {
      return new Date().toLocaleTimeString()
    }
  },
  methods: {
    async fetchWeather() {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${apiKey}&units=metric`
      try {
        const response = await axios.get(url)
        this.weather = response.data
        this.countryCode = response.data.sys.country
        this.sunriseTime = new Date(response.data.sys.sunrise * 1000).toLocaleTimeString()
        this.sunsetTime = new Date(response.data.sys.sunset * 1000).toLocaleTimeString()
        this.windDirection = response.data.wind.deg
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    },
    async fetchForecast() {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.cityName}&appid=${apiKey}&units=metric`
      try {
        const response = await axios.get(url)
        this.forecast = response.data
        this.renderChart()
      } catch (error) {
        console.error('Error fetching forecast:', error)
      }
    },
    renderChart() {
      const ctx = document.getElementById('weatherChart').getContext('2d')
      const labels = this.forecast.list.map((item) => item.dt_txt)
      const temperatures = this.forecast.list.map((item) => item.main.temp)

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Temperature (°C)',
              data: temperatures,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false
            }
          ]
        },
        options: {
          scales: {
            x: {
              display: true
            },
            y: {
              display: true,
              beginAtZero: true
            }
          }
        }
      })
    },
    async fetchSuggestions() {
      if (this.city.trim() === '') {
        this.suggestions = []
        return
      }
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/find?q=${this.city}&appid=${apiKey}&type=like&sort=population&cnt=5`
      try {
        const response = await axios.get(url)
        this.suggestions = response.data.list.map((item) => ({
          name: item.name,
          country: item.sys.country
        }))
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    },
    selectSuggestion(suggestion) {
      this.city = `${suggestion.country}-${suggestion.name}`
      this.suggestions = []
      this.navigateToCityWeather(suggestion.name)
    },
    navigateToCityWeather(cityName) {
      const name = cityName || this.city.split('-').pop()
      if (typeof name === 'string' && name.trim() !== '') {
        this.$router.push({ name: 'CityWeather', params: { cityName: name.trim() } })
      }
    }
  },
  async mounted() {
    await this.fetchWeather()
    await this.fetchForecast()
  }
}
</script>

<style scoped>
.header {
  padding: 1rem;
}
.search-bar input {
  background: transparent;
}
.weather-icon {
  width: 100px;
  height: 100px;
}
</style>
