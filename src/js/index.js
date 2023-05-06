import axios from 'axios';
import { Notify } from 'notiflix';
import { Search } from './settingsSearch';

const searchValue = new Search();

const KEY = '35105940-051708562a54e8fbc749fff56';
const PER_PAGE = 40;
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form__input'),
  btn: document.querySelector('.search-form__btn'),
  galeryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

async function fetchData(value) {
  try {
    return await axios.get(
      `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${searchValue.page}`
    );
  } catch {
    throw new Error('invalid request');
  }
}

const handlerSubmit = evt => {
  evt.preventDefault();
  searchValue.page = 1;
  searchValue.q = evt.currentTarget.searchQuery.value;
  searchValue.per_page = PER_PAGE;
  refs.galeryEl.innerHTML = '';
  refs.loadMore.classList.add('hidden');

  if (refs.input.value.trim() === '') {
    Notify.failure('Please enter your request');
    return;
  }

  fetchData(searchValue.q)
    .then(({ data }) => {
      console.log(data.totalHits);
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      data.hits.map(el => {
        refs.galeryEl.insertAdjacentHTML('afterbegin', markupCard(el));
      });
      return data;
    })
    .then(data => {
      if (data.hits.length >= PER_PAGE) {
        refs.loadMore.classList.remove('hidden');
      }
    })
    .catch(() => console.warn('error! Invalid request'));
};

function markupCard({ webformatURL, tags, likes, views, comments, downloads }) {
  return `
  <div class="photo-card">
  <div class="thumb">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" height="200px"/>
  </div>
  <div class="info">
    <p class="info-item">
      <b>likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>downloads</b>
      ${downloads}
    </p>
  </div>
</div>
  `;
}

function moreGalleryImg() {
  searchValue.page += 1;

  fetchData(searchValue.q)
    .then(({ data }) => {
      searchValue.per_page += data.hits.length;

      console.log(searchValue.per_page);
      if (data.hits.length < PER_PAGE) {
        refs.loadMore.classList.add('hidden');
      }

      if (searchValue.per_page >= data.totalHits) {
        Notify.failure(
          `"We're sorry, but you've reached the end of search results."`
        );
        refs.loadMore.classList.add('hidden');
      }

      return data.hits.map(el => {
        refs.galeryEl.insertAdjacentHTML('beforeend', markupCard(el));
      });
    })
    .catch(() => console.warn('error! Invalid request'));
}
refs.form.addEventListener('submit', handlerSubmit);
refs.loadMore.addEventListener('click', moreGalleryImg);
