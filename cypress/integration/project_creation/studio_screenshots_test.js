describe('XYZ Maps Screenshot', () => {
  it('Re-renders DOM on Screenshot', () => {
    //cy.viewport(1280, 920);
    cy.clearCookies();

    //Navigate to - https://account.here.com/sign-in
    cy.visit('https://account.here.com/sign-in');

    //Enter User
    cy.get('#sign-in-email')
      .clear()
      .type('cypress.io.tests@gmail.com');

    //Enter Password
    cy.get('#sign-in-password-encrypted')
      .clear()
      .type('cypress.io.tests'); //"zyxtsetu1")

    //Sign On
    cy.get('#signInBtn').click();

    cy.get('#button-signout');

    //Navigate to studio
    cy.visit('https://xyz.here.com/studio/');

    cy.server();
    let STUDIO_HUB_SERVER = 'https://xyz.api.here.com';
    cy.route('GET', STUDIO_HUB_SERVER + '/tiles/herebase**/copyright').as(
      'tilesApiGetCall'
    );

    //Reset Application State by deleteing All Studio Projects - //GET - https://xyz.api.here.com/hub/spaces
    cy.deleteAllStudioProjects({ studioHubServerUrl: STUDIO_HUB_SERVER });

    //Reset Application State by deleteing All Spaces Data - //GET - https://xyz.api.here.com/hub/spaces
    cy.deleteAllStudioSpaces({ studioHubServerUrl: STUDIO_HUB_SERVER });

    //Click Create New Project Button
    cy.log('Click Create New Project Button');
    cy.contains('Create new project')
      .click()
      .wait('@tilesApiGetCall');

    cy.wait(1000);

    //cy.viewport(1920, 1080)
    cy.screenshot({});
  });
});
