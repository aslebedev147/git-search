import { get } from './http';

const ApiBase = 'https://api.github.com';

export const loadOrganisationRepos = organisation => get(`${ApiBase}/orgs/${organisation}/repos`)
    .then(results => results)
    .catch(() => []);
