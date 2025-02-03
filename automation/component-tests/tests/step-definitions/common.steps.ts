import { Then } from '@cucumber/cucumber';
import { App } from '../../src/app/app';
import { assertApiResponse } from '../../src/utils/service-client/api-assertions';

Then(
  'the {string} request should succeed with a status of {string}',
  function (this: App, res: string, statusString: string) {
    const response = this.world.fromPhrase(res, 'Response');
    assertApiResponse(response, statusString);
  }
);

Then(
  'the {string} request should fail with a status of {string}',
  function (this: App, res: string, statusString: string) {
    const response = this.world.fromPhrase(res, 'Response');
    assertApiResponse(response, statusString);
  }
);