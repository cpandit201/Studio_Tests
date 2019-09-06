# Automated Tests for XYZ Studio 

Cypress end-to end test for XYZ Studio 

[![Build Status](https://travis-ci.org/cpandit201/Studio_Tests.svg?branch=master)](https://travis-ci.org/cpandit201/Studio_Tests)

Navigate to project root and execute below command to execute tests headlessly

`$<project-root>/npm run-script test:ci` 

If we want to execute tests on local browser, Execute 

`$<project-root>/npm run-script test:local` 

The build script for testing the pronject will perform the following activities
- Trigger the npm build process for XYZ Studio
- Start server on port :3000
- Execute the tests either locally or headlessly based on the command :ci or :local
- Create a video file for the entire execution
- Store the Video file in Build Directory on project root as an archive.
- In Jenkins we can then use the `	Build Artifacts`  link for getting the video file for future use.


### Pre-conditions before running these tests, 
- Make sure project is getting built without any compilation errors by installing it
- Close all applications running on port 3000


# Developing tests 
- Start the server locally
- Navigate to cypress tests directory
`$ cd e2e_tests/cypress_studio_tests/`
- Open Cypress UI by 
`npx cypress open`
- Select the spec file which you need to run
- Make the changes to the spec file and save. Cypress will watch for new tests. If there are any new tests Cypress will pick those and execute.
