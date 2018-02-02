import { json } from '@scola/codec';

import {
  ErrorReporter,
  FormBuilder,
  FormReader,
  PanelDisabler
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';

import { ObjectHeader } from '../add';

import {
  Requester,
  Resolver
} from '../worker';

import {
  filterDisabler,
  formatDefaultError,
  formatForm,
  formatValidatorError
} from '../helper';

export default function createAdd(structure, route, helper) {
  const objectReader = new FormReader();

  const objectBuilder = new FormBuilder({
    format: formatForm(helper.format()),
    target: 'form-add',
    structure: structure.add.form
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const objectHeader = new ObjectHeader({
    format: helper.format()
  });

  const objectPoster = new Requester({
    route: route.poster
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const objectResolver = new Resolver({
    route: route.resolver
  });

  const validator = new Validator({
    structure: structure.add.form
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(helper.format())
  });

  objectDisabler
    .hide({
      permission: helper.permission('add'),
      selector: '.body, .bar'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(objectBuilder)
    .connect(objectReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(objectPoster)
    .through(createBrowser(json))
    .connect(objectReporter)
    .connect(objectResolver);

  return [objectHeader, objectResolver];
}
