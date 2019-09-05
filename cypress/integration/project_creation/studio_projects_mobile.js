require('cypress-xpath');

const STUDIO_URL =
  'http://xyz-studio.dev.internal.community.nw.ops.here.com/studio/'; //'http://localhost:3000/'; // 'https://xyz.here.com/studio/'
const STUDIO_LOGIN_URL =
  'https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https%3A%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&track-id=trackUPMUI&lang=en-us';
const STUDIO_USER = 'xyzusermum@gmail.com';
const STUDIO_PASSWORD = 'zyxtsetu1';

describe('XYZ Studio Mobile', () => {
  it('Should be able to render projects screen when no projects are present', () => {
    // Set viewport to desktop resolutions
    cy.viewport('iphone-6+');

    cy.request({
      url: 'https://account.here.com/templates/accountSharedPage/formSignIn',
      method: 'GET',
      headers: {},
    });

    cy.request({
      url: 'https://account.here.com/api/account/sign-in-with-password',
      body: {
        realm: 'here',
        email: STUDIO_USER, //'xyzusermum@gmail.com',
        password: STUDIO_PASSWORD, //'zyxtsetu1',
        rememberMe: true,
      },
      method: 'POST',
      headers: {
        origin: 'https://account.here.com',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        Cookie:
          'locale=en-US; here_account=eyJjc3JmU2VjcmV0IjoiQUpRdTZZdTlCbnA5RWFZZl9UTEhJREgxIn0=; here_account.sig=dSmXMCs0AcOLA_k9gDOxoCk08zg; AMCV_E16CD4415481B5550A4C98A2%40AdobeOrg=432708069%7CMCMID%7C11362136000907772445735772506179917739%7CMCAAMLH-1555346718%7C3%7CMCAAMB-1555346718%7Cj8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI; s_cc=true; s_prop56=15; s_nr=1554742752078-New; s_sq=nokiahereaccountfwg0prod%3D%2526pid%253Dhere%25253Aaccount%25253Afw%25253Asign-in%2526pidt%253D1%2526oid%253DSign%252520in%2526oidt%253D3%2526ot%253DSUBMIT',
        'x-csrf-token': 'Gfn5zIhe-RPTS5MR1TX_frY1lNuRY5AAsBss',
        'x-client': 'es1HEn2LGqFocvfD1eEt',
        'x-realm': 'here',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Set DASHBOARD_TOUR_VISITED, NOTIFICATION_VIEWED = true so that popup does not appear
    window.localStorage.setItem('DASHBOARD_TOUR_VISITED', 'true');
    window.localStorage.setItem('PROJECT_TOUR_VISITED', 'true');
    window.localStorage.setItem('NOTIFICATION_VIEWED', 'true');

    cy.visit(STUDIO_URL);

    // Intercept Project API and return zero projects from project API
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://xyz.api.here.com/project-api/projects',
      status: 200,
      response: [],
    });

    cy.visit(STUDIO_URL);
  });
});
