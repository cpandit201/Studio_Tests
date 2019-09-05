import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
  // failureThreshold: 0.02, // threshold for entire image
  // failureThresholdType: 'percent', // percent of image or number of pixels
  // customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
  // capture: 'viewport', // capture viewport in screenshot
  // failureThreshold: 0.3, // threshold for entire image
  // failureThresholdType: 'percent', // percent of image or number of pixels
});

//Set this to true because of this defect in Cypress - https://github.com/cypress-io/cypress/issues/4891
Cypress.Screenshot.defaults({});

/**
 * Login to Studio Home page
 */
Cypress.Commands.add('loginToStudioSSO', ({ email, password }) => {
  // Set viewport to desktop resolutions
  //cy.viewport(1200, 500);
  cy.clearCookies();
  let cookie = '';
  cy.request({
    url: 'https://account.here.com/templates/accountSharedPage/formSignIn',
    method: 'GET',
    headers: {},
  }).should(response => {
    console.log(response);
    cookie = response.requestHeaders.cookie;
    //let csrfToken = window.here.csrf;
    console.log(cookie);
    //console.log(csrfToken)
  });

  // //Request Accounts API for getting CSRF Token - https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https%3A%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&track-id=trackUPMUI&lang=en-us
  // cy.request({
  //   url: 'https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https%3A%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&track-id=trackUPMUI&lang=en-us',
  //   method: 'GET',
  //   form: true
  // }).should (response => {
  //   console.log(response.body)
  //   let responseBody = response.body
  //   //let csrfToken = responseBody.substring(start, end)
  // // }).debug();
  // cy.forceVisit("https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https%3A%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&track-id=trackUPMUI&lang=en-us")
  //   .then(() => {

  //   }).debug();

  cy.request({
    url: 'https://account.here.com/api/account/sign-in-with-password',
    body: {
      realm: 'here',
      email: email, //'xyzusermum@gmail.com',
      password: password, //'zyxtsetu1',
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
  }).debug();

  //Get Browser Cookie associated with 'here_account', 'locale', here_account.sig

  //Get X-CSRF Token from window object

  // Set DASHBOARD_TOUR_VISITED, NOTIFICATION_VIEWED = true so that popup does not appear
  window.localStorage.setItem('DASHBOARD_TOUR_VISITED', 'true');
  window.localStorage.setItem('PROJECT_TOUR_VISITED', 'true');
  window.localStorage.setItem('NOTIFICATION_VIEWED', 'true');
});

/**
 * Login to Studio Home page
 */
Cypress.Commands.add('loginToStudio_old', ({ email, password }) => {
  // Set viewport to desktop resolutions
  //cy.viewport(1200, 500);
  cy.clearCookies();

  //Navigate to - https://account.here.com/sign-in
  let url = 'https://account.here.com/'//'https://st.p.account.here.com/'; 
  cy.forceVisit(url + 'sign-in')
    .get('body')
    .then($body => {
      // synchronously query from body
      // to find which element was created
      if ($body.find('#button-signout').length) {
        // input was found, do something else here
        $body.find('#button-signout').click();
      }
    });

  //cy.forceVisit("https://account.here.com/sign-in")

  //cy.visit(url)

  //Enter User
  cy.get('#sign-in-email')
    .clear()
    .type(email); //"xyzusermum@gmail.com")

  //Enter Password
  cy.get('#sign-in-password-encrypted')
    .clear()
    .type(password); //"zyxtsetu1")

  cy.server();
  cy.route(url).as('accountsPage');

  //Sign On
  cy.get('#signInBtn').click();

  cy.get('#button-signout');

  //Get Browser Cookie associated with 'here_account', 'locale', here_account.sig

  //Get X-CSRF Token from window object

  // Set DASHBOARD_TOUR_VISITED, NOTIFICATION_VIEWED = true so that popup does not appear
  window.localStorage.setItem('DASHBOARD_TOUR_VISITED', 'true');
  window.localStorage.setItem('PROJECT_TOUR_VISITED', 'true');
  window.localStorage.setItem('NOTIFICATION_VIEWED', 'true');
});

/**
 * Login to Studio Home page
 */
Cypress.Commands.add('loginToStudio', ({ email, password }) => {
  // Set viewport to desktop resolutions
  //cy.viewport(1200, 500);
  cy.clearCookies();

  //Navigate to - https://account.here.com/sign-in
  let url = 'https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https:%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&uat-duration=86400&track-id=trackUPMUI&lang=en-us'
  //'https://account.here.com/'//'https://st.p.account.here.com/'; 
  let isLoggedIn = false;
  cy.forceVisit(url + 'sign-in')
    .get('body')
    .then($body => {
      // synchronously query from body
      // to find which element was created
      console.log($body.find('h2'))
      if ($body.find('h2').length > 0) {
        // input was found, do something else here
        $body.find('h2').click();
        isLoggedIn = true
        console.log("Found Done, logged in")
      }
      else {
        console.log("Cannot find Done, Not logged in")

        //Enter User
        cy.get('#sign-in-email')
          .clear()
          .type(email); //"xyzusermum@gmail.com")

        //Enter Password
        cy.get('#sign-in-password-encrypted')
          .clear()
          .type(password); //"zyxtsetu1")

        cy.server();
        cy.route(url).as('accountsPage');

        //Sign On
        cy.get('#signInBtn').click();

        cy.contains('Done');


      }
    });

  //cy.forceVisit("https://account.here.com/sign-in")

  //cy.visit(url)

  if (isLoggedIn) {

  }

  //Get Browser Cookie associated with 'here_account', 'locale', here_account.sig

  //Get X-CSRF Token from window object

  // Set DASHBOARD_TOUR_VISITED, NOTIFICATION_VIEWED = true so that popup does not appear
  window.localStorage.setItem('DASHBOARD_TOUR_VISITED', 'true');
  window.localStorage.setItem('PROJECT_TOUR_VISITED', 'true');
  window.localStorage.setItem('NOTIFICATION_VIEWED', 'true');
});

/**
 * Delete All Projects - Teardown function to reset projects screen back with zero projects
 */
Cypress.Commands.add('deleteAllStudioProjects', ({ studioHubServerUrl }) => {
  cy.log('Delete all studio projects');
  cy.request('GET', studioHubServerUrl + '/project-api/projects').then(
    response => {
      console.log(response);

      //Iterate over response body and send DELETE Request for each project created if any?
      response.body.map(currentProject => {
        console.log(currentProject.id);
        let currentProjectId = currentProject.id;
        cy.request(
          'DELETE',
          studioHubServerUrl + '/project-api/projects/' + currentProjectId
        );
      });
    }
  );
  cy.log('Deleted all studio projects...');
});

/**
 * Delete All Projects - Teardown function to reset projects screen back with zero projects
 */
Cypress.Commands.add('deleteAllStudioSpaces', ({ studioHubServerUrl }) => {
  cy.log(
    'Reset Application Spaces State by deleteing All Spaces Data - //GET - https://xyz.api.here.com/hub/spaces '
  );
  cy.request('GET', studioHubServerUrl + '/hub/spaces').then(response => {
    console.log(response);
    response.body.map(currentSpace => {
      //Delete Current Space
      let spaceId = currentSpace.id;
      cy.log('Delete all space for ' + spaceId);
      cy.request('DELETE', studioHubServerUrl + '/hub/spaces/' + spaceId);
    });
  });
});

Cypress.Commands.add('forceVisit', url => {
  cy.get('body').then(body$ => {
    const appWindow = body$[0].ownerDocument.defaultView;
    const appIframe = appWindow.parent.document.querySelector('iframe');

    // We return a promise here because we don't want to
    // continue from this command until the new page is
    // loaded.
    return new Promise(resolve => {
      appIframe.onload = () => resolve();
      appWindow.location = url;
      console.log(window.here);
    });
  });
});
