import {
  checkFilesExist,
  killPorts,
  newProject,
  readJson,
  runCLI,
  uniq,
} from '@nrwl/e2e/utils';

describe('Cypress Component Test runner', () => {
  beforeAll(() => newProject());

  describe('apps', () => {
    const appName = uniq('cy-react-test-app');

    it('should add cypress component tests to existing app', () => {
      runCLI(`generate @nrwl/react:app ${appName}`);
      runCLI(
        `generate @nrwl/cypress:cy-cmp ${appName} --componentType=react --compiler=babel`
      );
      runCLI(
        `generate @nrwl/cypress:cy-test --project=${appName} --name=app --componentType=react --dir=app`
      );
      // createFile(
      //   `apps/${appName}/src/app/app.cy.tsx`,
      //   `
      //   import React from 'react';
      //   import { mount } from '@cypress/react';
      //   import App from './app';
      //
      //   describe(App.name, () => {
      //     it('should create', () => {
      //       mount(<App />);
      //       cy.contains(/Welcome/i);
      //     });
      //   });
      //   `
      // );

      const packageJson = readJson('package.json');
      expect(packageJson.devDependencies['cypress']).toBeTruthy();
      checkFilesExist(
        `apps/${appName}/cypress.config.ts`,
        `apps/${appName}/tsconfig.cy.json`,
        `apps/${appName}/cypress/component/index.html`,
        `apps/${appName}/cypress/fixtures/example.json`,
        `apps/${appName}/cypress/support/component.ts`
      );
    }, 1000000);

    it('should successfully run default cypress tests', async () => {
      expect(runCLI(`comp-test ${appName} --no-watch`)).toContain(
        'All specs passed!'
      );
      await killPorts(8080);
    }, 1000000);
  });

  describe('libs', () => {
    const libName = uniq('cy-react-test-lib');
    it('should generate w/ cypress component tests', () => {
      runCLI(`generate @nrwl/react:lib ${libName} --cy --compiler=swc`);

      checkFilesExist(
        `libs/${libName}/cypress.config.ts`,
        `libs/${libName}/src/lib/${libName}.cy.tsx`,
        `libs/${libName}/tsconfig.cy.json`,
        `libs/${libName}/cypress/component/index.html`,
        `libs/${libName}/cypress/fixtures/example.json`,
        `libs/${libName}/cypress/support/component.ts`
      );
    }, 1000000);

    it('should successfully run default cypress tests', async () => {
      expect(runCLI(`comp-test ${libName} --no-watch`)).toContain(
        'All specs passed!'
      );
      await killPorts(8080);
    }, 1000000);
  });
});
