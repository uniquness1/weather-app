<template>
  <div class="weather-app w-full">
    <div class="p-4 grid max-w-[1200px] mx-auto h-[60dvh] lg:h-screen m-0">
      <div class="w-full flex flex-col justify-center">
        <h1 class="text-white text-4xl md:text-7xl font-bold py-5">
          Weather App <br />
          Weather Forecast
        </h1>
        <p class="text-white text-base sm:text-lg pl-6 border-l-2 max-w-lg w-full">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do elit eiusmod tempor
          incididunt ut labore et dolore.
        </p>
        <div class="search-bar py-5">
          <div
            class="flex items-center gap-5 justify-between bg-white py-1 max-w-[500px] px-2 rounded"
          >
            <input
              class="outline-none w-full text-lg font-medium text-black"
              type="text"
              v-model="city"
              placeholder="Enter city name"
              @keyup="fetchSuggestions"
              @keyup.enter="navigateToCityWeather"
            />
            <button
              class="bg-[#8a7a1e] py-2 px-10 rounded text-white"
              @click="navigateToCityWeather"
            >
              Search
            </button>
          </div>
          <ul v-if="suggestions.length" class="bg-white border rounded mt-2">
            <li
              v-for="suggestion in suggestions"
              :key="suggestion.name"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion.name }} - {{ suggestion.country }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="weather-info max-w-[1200px] mx-auto px-4 pb-20">
    <h2 class="text-black text-4xl py-10">Top Cities</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
      <div
        v-for="city in topCitiesWeather"
        :key="city.name"
        class="bg-slate-900 p-4 rounded shadow cursor-pointer"
        @click="navigateToCityWeather(city.name)"
      >
        <img
          v-if="city.weather"
          :src="`https://openweathermap.org/img/wn/${city.weather.weather[0].icon}@2x.png`"
          :alt="city.weather.weather[0].description"
          class="weather-icon"
        />
        <p v-else>Loading...</p>
        <h3 class="text-xl font-medium text-white">{{ city.name }} - {{ city.country }}</h3>
        <p class="text-white text-sm font-normal" v-if="city.weather">
          Temperature: {{ city.weather.main.temp }}°C
        </p>
        <p class="text-white text-sm font-normal" v-if="city.weather">
          Weather: {{ city.weather.weather[0].description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      city: '',
      suggestions: [],
      topCities: [
        'Ikeja',
        'Ado Ekiti',
        'London',
        'New York',
        'Beijing',
        'Los Angeles',
        'Mumbai',
        'Berlin',
        'Tokyo',
        'Paris',
        'Cairo',
        'Seoul',
        'Singapore',
        'Johannesburg',
        'Hong Kong'
      ],
      topCitiesWeather: []
    }
  },
  methods: {
    async fetchTopCitiesWeather() {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      for (const city of this.topCities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        try {
          const response = await axios.get(url)
          this.topCitiesWeather.push({
            name: city,
            country: response.data.sys.country,
            weather: response.data
          })
        } catch (error) {
          console.error('Error fetching top city weather:', error)
          this.topCitiesWeather.push({
            name: city,
            country: 'N/A',
            weather: null
          })
        }
      }
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
    await this.fetchTopCitiesWeather()
  }
}
</script>

<style scoped>
.weather-app {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(@/assets/images/1.jpg);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
input {
  background: transparent;
}
.weather-icon {
  width: 50px;
  height: 50px;
}
</style>
