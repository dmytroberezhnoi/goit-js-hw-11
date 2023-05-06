export class Search {
  pages;
  q = null;
  per_page;
  constructor(value = 1) {
    this.pages = value;
  }
  get page() {
    return this.pages;
  }

  set page(newValue) {
    this.pages = newValue;
  }
}

// console.log(loadMore.page);
