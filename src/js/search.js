import { loadOrganisationRepos } from './api';

const Selector = {
    input: '.search__input',
    resultsList: '.search__results',
    spinnerIcon: '.search__spinner',
    clearIcon: '.search__clear',
}

const Class = {
    resultsVisible: 'search__results_visible',
    spinnerIconVisible: 'search__spinner_visible',
    clearIconVisible: 'search__clear_visible'
}

const Organisation = 'kraftvaerk';

class Search {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.input = this.element.querySelector(Selector.input);
        this.spinnerIcon = this.element.querySelector(Selector.spinnerIcon);
        this.clearIcon = this.element.querySelector(Selector.clearIcon);
        this.resultsList = this.element.querySelector(Selector.resultsList);

        this.keyword = '';
        this.repos = [];
        this.results = [];
        this.loading = false;
        this.addEventListeners();
    }

    loadRepos() {
        this.loading = true;
        this.clearIcon.classList.remove(Class.clearIconVisible);
        this.spinnerIcon.classList.add(Class.spinnerIconVisible);
        const self = this;

        loadOrganisationRepos(Organisation).then(results => {
            if (results.length > 0) {
                self.repos = results;
                self.loading = false;
                self.spinnerIcon.classList.remove(Class.spinnerIconVisible);
                self.update();
            } else {
                self.loadRepos();
            }
        }).catch(() => self.loadRepos());
    }

    addEventListeners() {
        const self = this;

        this.input.addEventListener('input', event => {
            const value = (event.target.value || '').trim();
            self.keyword = value;

            if (value.length > 2 && self.repos.length === 0 && !self.loading) {
                self.loadRepos();
            } else {
                self.update();
            }
        });

        this.input.addEventListener('focus', () => {
            if (self.results.length > 0) {
                self.showResults();
            }
        });

        this.clearIcon.addEventListener('click', () => {
            self.input.focus();
            self.keyword = '';
            self.input.value = '';
            self.update();
        });

        document.body.parentElement.addEventListener('click', event => {
            if (self.element !== event.target && !self.element.contains(event.target)) {
                self.hideResults();
            }
        });
    }

    update() {
        if (this.keyword.length > 0 && !this.loading) {
            this.clearIcon.classList.add(Class.clearIconVisible);
        } else {
            this.clearIcon.classList.remove(Class.clearIconVisible);
        }

        if (this.keyword.length > 2) {
            this.updateResults(this.sortResults(this.filterResults(this.keyword)));
        } else {
            this.hideResults();
            this.clearResults();
        }
    }

    filterResults(keyword) {
        return this.repos.filter(result => result.name.indexOf(keyword) !== -1);
    }

    sortResults(results) {
        results.sort((a, b) => a.name.localeCompare(b.name));
        return results;
    }

    showResults() {
        this.resultsList.classList.add(Class.resultsVisible);
    }

    hideResults() {
        this.resultsList.classList.remove(Class.resultsVisible);
    }

    clearResults() {
        this.results = [];
        this.resultsList.innerHTML = '';
    }

    updateResults(results) {
        this.hideResults();
        this.clearResults();
        this.results = results;
        
        if (results.length > 0) {
            const self = this;

            results.forEach(item => {
                const element = document.createElement('li');
                element.innerText = item.name;
                self.resultsList.appendChild(element);
            });

            this.showResults();
        }
    }
}

export default Search;