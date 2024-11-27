//import assert from 'node:assert';
const assert = require('node:assert');
import { asConst } from '../data-utils/argument';
import { StatusCode } from './status-codes';

export function assertApiResponse(response: any, statusString: string) {
  const { status, statusText } = response;
  const constStatus = asConst(statusString);
  const statusCodeInstance = StatusCode[constStatus];
  assert.strictEqual(status, statusCodeInstance.status);
  assert.strictEqual(statusText, statusCodeInstance.statusText);
}
  
