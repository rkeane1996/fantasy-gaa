import { DEFAULT_THEME } from '@cucumber/pretty-formatter'

export default {
    format: ['html:reporting/cucumber-report/cucumber-report.html', '@cucumber/pretty-formatter'],
    formatOptions: {
      theme: {
        ...DEFAULT_THEME,
        'step text': 'magenta'
      }
    },
    paths: ['tests/features/**/*.feature'],
    require: [ 
        'tests/step-definitions/**/*.steps.ts',
        'tests/step-definitions/*.steps.ts',
    ],
    requireModule: [
        'ts-node/register'
      ]
  }