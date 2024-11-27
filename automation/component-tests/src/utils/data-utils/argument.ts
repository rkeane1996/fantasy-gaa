//import _ from 'lodash';
import * as _ from 'lodash';

export function asVar(sentence: string, suffix: string = '') {
  return _.camelCase(`${sentence}${suffix}`);
}

export function asConst(sentence: string) {
  return _.snakeCase(sentence).toUpperCase();
}