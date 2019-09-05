/// <reference types="Cypress" />
// type definitions for Cypress object "cy"
/// <reference types="cypress" />
// type definitions for custom commands like "createDefaultTodos"

require('cypress-xpath');
require('cypress-file-upload');

const STUDIO_URL =
  'https://xyz.here.com/studio/'//'http://localhost:3000/'; // 'http://xyz-studio.dev.internal.community.nw.ops.here.com/studio/';
const STUDIO_HUB_SERVER =  'https://xyz.api.here.com'//; 'https://xyz.sit.cpdev.aws.in.here.com';//
const STUDIO_LOGIN_URL =
  'https://account.here.com/sign-in?client-id=es1HEn2LGqFocvfD1eEt&version=4&sdk=true&type=frame&uri=https%3A%2F%2Fxyz.here.com&sign-in-screen-config=password,heread&frame-no-close=true&track-id=trackUPMUI&lang=en-us';

//User Details
const STUDIO_USER =  'xyzusermum@gmail.com'; //'chirag.pandit-test1@here.com';//
const STUDIO_PASSWORD = 'zyxtsetu1';// // 'Test123';//

describe('XYZ Studio', () => {
  it('Should show Add project card when no projects exists on studio dashboard', () => {
    cy.log('Simulating Login Scenario');
    cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

    cy.log('Login to studio home page');
    cy.visit(STUDIO_URL);

    // Intercept Project API and return zero projects from project API
    cy.log('Request Mocking Projects API Response');
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://xyz.api.here.com/project-api/projects',
      status: 200,
      response: [],
    });

    cy.visit(STUDIO_URL);

    cy.log(
      'Verify when no projects exists, there is a card present on studio dashboard'
    );
    cy.get('[data-tut="create-new-project"]').should('exist');

    //Match Image Screenshot
    //cy.document().matchImageSnapshot();
  });

  it('Should be able to create new project and screenshot should get generated on that project', () => {
    
    cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

    cy.deleteAllStudioProjects({ studioHubServerUrl: STUDIO_HUB_SERVER });

    cy.log('Deleted all studio projects...');

    //cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

    //Navigate to Studio Dashboard Home
    cy.log('Navigate to Studio Dashboard Home ');
    cy.visit(STUDIO_URL);

    //Set Backend API Aliases for dynamic waiting when project is edited
    cy.server();
    cy.route('PUT', STUDIO_HUB_SERVER + '/project-api/projects/**').as(
      'projectsApiPutCall'
    );
    cy.route('GET', STUDIO_HUB_SERVER + '/project-api/projects**').as(
      'projectsApiGetCall'
    );
    cy.route('GET', STUDIO_HUB_SERVER + '/tiles/herebase**/copyright').as(
      'tilesApiGetCall'
    );

    //Click Create New Project Button
    cy.log('Click Create New Project Button');
    cy.contains('Create new project')
      .click()
      .wait('@tilesApiGetCall');

    cy.wait(1000);

    //Enter Project Name
    cy.log('Enter Project Name');
    let projectName = 'Studio Test' + ' ' + new Date().getTime();

    cy.get('input[placeholder="Untitled Project"]')
      .click({ force: true })
      .get('input[placeholder="Untitled Project"][type="text"]')
      .type(projectName);

    //Enter Project Description
    cy.log('Enter Project Description');
    cy.contains('Please add description').click();
    cy.get('textarea[placeholder="Please add description here"]').type(
      projectName + ' description{enter}'
    );

    //Wait for All backend requests to get completed
    cy.wait('@projectsApiPutCall');

    //Set Map Center
    cy.window().then(win => {
      // Set Map Center to mumbai
      win.mapObject.setCenter(72.855497, 19.183957);
      win.mapObject.setZoomlevel(12);
    });
    //Wait for the project API Backend Put call to complete
    cy.wait('@projectsApiPutCall');

    //Go Back to Project Dashbaord
    cy.get('a[href^="/"]').click({ force: true });

    //Verify Whether project is created in Backend?

    //Verify Whether Project is shown on UI?
    cy.wait('@projectsApiGetCall');
    cy.log('Verify Whether Project is shown on UI?');
    cy.get('span').contains(projectName);

    cy.log('Verify screenshots are getting generated?');

    //Verify Screenshot is getting generated
    cy.get('img[alt="' + projectName + '"]')
      .should('have.attr', 'src')
      .then(href => {
        console.log('Image generated at - ' + href);
        //href.should('contain', 'screenshot')
        //Verify whether the generated screenshot contains a link to screenshot api
        cy.wrap({ src: href })
          .its('src')
          .should('contain', 'http')
          .should('contain', 'screenshot');
        //cy.wrap({src: href}).its('src').
      });

    //Delete all projects associated from backend
    cy.log('Teardown');
    cy.wait(300);
    //cy.deleteAllStudioProjects({studioHubServerUrl: STUDIO_HUB_SERVER})

    cy.deleteAllStudioProjects({ studioHubServerUrl: STUDIO_HUB_SERVER });

    cy.log('Deleted all studio projects...');
  });

  it('Should be able to upload CSV files in Studio project', () => {
    cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

    //Reset Application State by deleteing All Studio Projects - //GET - https://xyz.api.here.com/hub/spaces
    cy.deleteAllStudioProjects({ studioHubServerUrl: STUDIO_HUB_SERVER });

    //Reset Application State by deleteing All Spaces Data - //GET - https://xyz.api.here.com/hub/spaces
    cy.deleteAllStudioSpaces({ studioHubServerUrl: STUDIO_HUB_SERVER });

    //Set Backend API Aliases for dynamic waiting when project is edited
    cy.server();
    cy.route('PUT', STUDIO_HUB_SERVER + '/project-api/projects/**').as(
      'projectsApiPutCall'
    );
    cy.route('GET', STUDIO_HUB_SERVER + '/project-api/projects**').as(
      'projectsApiGetCall'
    );

    cy.route('GET', STUDIO_HUB_SERVER + '/tiles/herebase**/copyright').as(
      'tilesApiGetCall'
    );

    //Navigate to studio
    cy.log('Navigate to studio home');
    cy.visit(STUDIO_URL);

    //Wait for Projects API Get call
    cy.wait('@projectsApiGetCall');

    //Click Create New Project Button
    cy.log('Click Create New Project Button on studio home');

    cy.contains('Create new project')
      .click()
      .wait('@tilesApiGetCall');

    //Enter Project Name
    cy.log('Enter Project Name');
    let projectName =
      'Data Visualization Madrid Test - ' + ' ' + new Date().getTime();

    cy.get('input[placeholder="Untitled Project"]')
      .click({ force: true })
      .get('input[placeholder="Untitled Project"][type="text"]')
      .type(projectName);

    //Enter Project Description
    cy.log('Enter Project Description');
    cy.contains('Please add description').click();
    cy.get('textarea[placeholder="Please add description here"]').type(
      projectName + ' description{enter}'
    );

    //Wait for All backend requests to get completed
    cy.wait('@projectsApiPutCall');

    //Click Add Button
    cy.log("Click 'Add +' button");
    cy.get('span[data-tut="add-data"]').click();

    let fileName = 'stations.csv';

    const dropEvent = {
      force: true,
      dataTransfer: {
        files: [],
      },
    };

    var accessToken = window.localStorage.getItem('at');

    cy.readFile(fileName, 'base64').then(picture => {
      console.log(picture);
      return Cypress.Blob.base64StringToBlob(picture, 'text/csv').then(blob => {
        console.log(blob);
        blob.name = fileName; //'myFile.csv'
        dropEvent.dataTransfer.files.push(blob);
      });
    });

    cy.get('input[type="file"]')
      .first()
      .trigger('drop', dropEvent);

    //cy.wait(20 * 1000) //20 Seconds for file upload
    let uploadTImeout = 20 * 1000; // 20 Seconds
    //cy.wait("@projectsApiPutCall", { responseTimeout: uploadTImeout })
    cy.wait('@projectsApiPutCall');
    cy.contains('Add 1 dataset')
      .click()
      .wait('@projectsApiPutCall');

    //Remove Saved At element for taking dynamic screenshots
    cy.contains('Saved at').invoke('css', 'display', 'none');

    //Let map recenter
    cy.wait(3 * 1000);

    //Get Map's View Bounding box values and z-Index values
    cy.window().then(win => {
      let precision = 0.01;
      cy.log('Setting precision to ' + precision);

      let mapCenter = win.mapObject.getCenter(); // { longitude: -3.6773208333333347, latitude: 40.4325986111111 }
      cy.log(
        'Get mapCenter, Zoom Level should be equal to 12, accross MapCenter of : Madrid : ',
        mapCenter
      );
      let lonAssertiuon = Math.abs(mapCenter.longitude - -3.677) < precision;
      let latAssertiuon = Math.abs(mapCenter.latitude - 40.432) < precision;
      expect(lonAssertiuon).to.equal(
        true,
        'Expected : ' + -3.677 + ', Fetched : ' + mapCenter.longitude
      );
      expect(latAssertiuon).to.equal(
        true,
        'Expected : ' + -40.432 + ', Fetched : ' + mapCenter.latitude
      );

      let zoomLevel = win.mapObject.getZoomlevel();
      cy.log('Get zoomLevel', zoomLevel); // Zoom Level should be equal to 12, accross Madrid
      expect(zoomLevel).to.closeTo(
        12,
        2,
        'Zoom level should be equal to 12 around Madrid for the uploaded dataset'
      );

      let viewBounds = win.mapObject.getViewBounds();
      cy.log('Get viewBounds', viewBounds); // { minLon: -3.8369659138997463, minLat: 40.312280866493325, maxLon: -3.517675752766934, maxLat: 40.55270146167993 }
      //assert.equals(zoomLevel, 12, "Zoom level should be equal to 12 for the uploaded dataset")

      //Get MapObject's Layers - Should be more than 2
      expect(win.mapObject.layers.length).to.gte(
        2,
        'MapObject should consist of data layer'
      );

      let geoSpaceLayer = win.mapObject.layers.filter(item => {
        if (item.name.indexOf('GeoSpaceLayer') == 0)
          // Get the geoSpace layer
          return item;
      });

      //Get the point style for geoSpaceLayer should have a circle
      let circlePointStyle = geoSpaceLayer[0]._sd.styleGroups.pointStyle.filter(
        item => {
          if (item.type === 'Circle') return item;
        }
      );

      expect(circlePointStyle.length).to.gte(
        2,
        'Should have a circle point style on map'
      );
    });

    //Change the shape for points and validate
    cy.log('Click Layer Name - Stations');
    cy.contains('Stations')
      .click()
      .wait(500); //Wait for animations to complete

    //Click Points Data and change Default point style
    cy.contains('Points').click();

    cy.contains('Default point style').click();

    //Change the colors for Default Point Style to White
    cy.get("div[style^='background-color']:eq(0)").click();
    cy.get("input[value*='#']")
      .clear()
      .type('#FFFFFF{enter}');
    cy.get("div[style^='background-color']:eq(0)").click({ force: true });

    //Change the second color to grey
    cy.get("div[style^='background-color']:eq(1)").click();
    cy.get("input[value*='#']")
      .clear()
      .type('#CCCCCC{enter}');
    cy.get("div[style^='background-color']:eq(1)").click({ force: true });

    cy.wait(10);

    //cy.document().matchImageSnapshot("File uploaded screen snapshot with points circle");
    // cy.get('canvas').matchImageSnapshot(
    //   'File uploaded screen snapshot with points circle_canvas'
    // );

    //Get mapObject's geospaceLayer shape and color be circle and white
    //Check whether map GeoSpace layer has the correct color styles
    cy.window().then(win => {
      let geoSpaceLayer = win.mapObject.layers.filter(item => {
        if (item.name.indexOf('GeoSpaceLayer') == 0)
          // Get the geoSpace layer
          return item;
      });

      //Get the point style for geoSpaceLayer should have a circle with White fill
      let circlePointStyle = geoSpaceLayer[0]._sd.styleGroups.pointStyle.filter(
        item => {
          if (item.type === 'Circle' && item.fill === 'rgba(255,255,255,1)')
            return item;
        }
      );

      expect(circlePointStyle.length).to.gte(
        1,
        'Map point style should have a fill of white'
      );
    });

    cy.get('select')
      .select('Square')
      .wait(700); // Wait for 3 seconds for the map to refresh with new styling

    //Check whether map GeoSpace layer has the correct color styles
    cy.window().then(win => {
      let geoSpaceLayer = win.mapObject.layers.filter(item => {
        if (item.name.indexOf('GeoSpaceLayer') == 0)
          // Get the geoSpace layer
          return item;
      });

      //Get the point style for geoSpaceLayer should have a circle with White fill
      let squarePointStyle = geoSpaceLayer[0]._sd.styleGroups.pointStyle.filter(
        item => {
          if (item.type === 'Rect' && item.fill === 'rgba(255,255,255,1)')
            return item;
        }
      );

      expect(squarePointStyle.length).to.gte(
        1,
        'Map point style should have a rect fill of white'
      );
    });

    //Click Cards
    cy.contains('Points').click({ force: true });
    cy.contains('Cards').click({ force: true });

    cy.wait(100);

    //Unable to drag drop cards in Cypress
    // cy.contains("name")
    //   //.trigger('dragstart')
    //   .trigger("mousedown", { which: 1 })
    //   .trigger("mousemove", 30,30)
    //   .trigger("mouseup")//Reselct
    // cy.contains("address")
    //   //.trigger('drop')
    //   .trigger("mousemove")
    //   .trigger("mouseup")

    //Click data tab - should become blue on clicking
    cy.get('button:contains("Data")')
      .click()
      .wait(300)
      .should('have.css', 'background-color', 'rgb(45, 213, 201)'); // Blue Background

    cy.get(
      "h3:contains('24 features currently visible on map out of a total')"
    ).should('have.css', 'display');

    //cy.document().matchImageSnapshot("File uploaded screen snapshot with points square");
    //Get mapObject's  geospaceLayer shape and color - Should be square and white

    // cy.get('canvas').matchImageSnapshot(
    //   'File uploaded screen snapshot with points square_canvas'
    // );
  });

  // it("should verify point visualizations", () => {
  //   cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

  //   //Reset Application State by deleteing All Studio Projects - //GET - https://xyz.api.here.com/hub/spaces
  //   cy.deleteAllStudioProjects({ studioHubServerUrl: STUDIO_HUB_SERVER });

  //   //Reset Application State by deleteing All Spaces Data - //GET - https://xyz.api.here.com/hub/spaces
  //   cy.deleteAllStudioSpaces({ studioHubServerUrl: STUDIO_HUB_SERVER });

  //   //Set Backend API Aliases for dynamic waiting when project is edited
  //   cy.server();
  //   cy.route('PUT', STUDIO_HUB_SERVER + '/project-api/projects/**').as(
  //     'projectsApiPutCall'
  //   );
  //   cy.route('GET', STUDIO_HUB_SERVER + '/project-api/projects**').as(
  //     'projectsApiGetCall'
  //   );

  //   cy.route('GET', STUDIO_HUB_SERVER + '/tiles/herebase**/copyright').as(
  //     'tilesApiGetCall'
  //   );

  //   //Navigate to studio
  //   cy.log('Navigate to studio home');
  //   cy.visit(STUDIO_URL);

  //     //Click Project where CSV Fil;e was uploaded

  //     //Change its point shape to square

  //     //Change point shape to no shape

  //     //Revert that point shape to Circle

  // })

  // it.skip('Test', () => {
  //   cy.log('Simulating Login Scenario');
  //   cy.loginToStudio({ email: STUDIO_USER, password: STUDIO_PASSWORD });

  //   cy.log('Login to studio home page');
  //   cy.visit(STUDIO_URL);

  //   // Intercept Project API and return zero projects from project API
  //   cy.log('Request Mocking Projects API Response');
  //   cy.server();
  //   cy.route({
  //     method: 'GET',
  //     url: 'https://xyz.api.here.com/project-api/projects',
  //     status: 200,
  //     response: [],
  //   });

  //   cy.visit(STUDIO_URL);

  //   cy.log(
  //     'Verify when no projects exists, there is a card present on studio dashboard'
  //   );
  //   cy.get('[data-tut="create-new-project"]').should('exist');
  // });
});

// function DndSimulatorDataTransfer() {
//   this.data = {}
// }

// DndSimulatorDataTransfer.prototype.dropEffect = "move"
// DndSimulatorDataTransfer.prototype.effectAllowed = "all"
// DndSimulatorDataTransfer.prototype.files = []
// DndSimulatorDataTransfer.prototype.items = []
// DndSimulatorDataTransfer.prototype.types = []

// DndSimulatorDataTransfer.prototype.clearData = function(format) {
//   if(format) {
//     delete this.data[format]

//     const index = this.types.indexOf(format)
//     delete this.types[index]
//     delete this.data[index]
//   } else {
//     this.data = {}
//   }
// }

// DndSimulatorDataTransfer.prototype.setData = function(format, data) {
//   this.data[format] = data
//   this.items.push(data)
//   this.types.push(format)
// }

// DndSimulatorDataTransfer.prototype.getData = function(format) {
//   if(format in this.data) {
//     return this.data[format]
//   }

//   return ""
// }

// DndSimulatorDataTransfer.prototype.setDragImage = function(img, xOffset, yOffset) {
//   // since simulation doesn"t replicate the visual
//   // effects, there is no point in implementing this
// }
