import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

function createCountryListMarkup(countries) {
  const markup = countries
    .map(
      ({ name, flags }) => `<li class="country-item">
    <img class="country-flag" src="${flags.svg}" alt="${name.official} flag">
    <p>${name.official}</p>
  </li>`
    )
    .join('');
  countryListEl.innerHTML = markup;
}

function craeteCountryMarkup(country) {
  const markup = country.map(
    ({
      name,
      capital,
      population,
      flags,
      languages,
    }) => `<div class="country-box">
    <img class="country-flag" src="${flags.svg}" alt="${name.official} flag"><p class="country-name">${name.official}</p>
  </div>
  <p class="country-subtitle"><span class="country-text">Capital: </span>${capital}</p>
<p class="country-subtitle"><span class="country-text">Population: </span>${population}</p>
<p class="country-subtitle"><span class="country-text">Languages: </span>${Object.values(languages)}</p>`
  );
  countryInfoEl.innerHTML = markup;
}

function handleCountryInput() {
    if(inputEl.value.trim() === '') {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return;
    }
  fetchCountries(inputEl.value.trim())
    .then(data => {
      if (data.length > 10) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        countryInfoEl.innerHTML = '';
        return createCountryListMarkup(data);
      } else if (data.length === 1) {
        countryListEl.innerHTML = '';
        console.log(data);
        return craeteCountryMarkup(data);
      }
    })
    .catch(() => {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return Notify.failure('Oops, there is no country with that name.')});
}

inputEl.addEventListener('input', debounce(handleCountryInput, DEBOUNCE_DELAY));
