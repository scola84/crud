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

export default function createAdd(structure, route) {
  const adder = new Requester({
    id: 'crud-adder',
    route: route.add
  });

  const addBuilder = new FormBuilder({
    format: formatForm(route.format()),
    id: 'crud-add-builder',
    structure: structure.add.form,
    target: 'form-add'
  });

  const addReader = new FormReader({
    id: 'crud-add-reader'
  });

  const addReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'long'),
    id: 'crud-add-reporter'
  });

  const addResolver = new Resolver({
    id: 'crud-add-resolver',
    route: route.resolve
  });

  const addValidator = new Validator({
    id: 'crud-add-validator',
    structure: structure.add.form
  });

  const addValidatorReporter = new ErrorReporter({
    format: formatValidatorError(route.format()),
    id: 'crud-add-validator-reporter'
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-add-object-disabler'
  });

  const objectHeader = new ObjectHeader({
    format: route.format(),
    id: 'crud-add-object-header'
  });

  objectDisabler
    .disable({
      permission: route.permission('add'),
      selector: '.body, .bar .right'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(addBuilder)
    .connect(addReader)
    .connect(addValidator)
    .connect(addValidatorReporter)
    .connect(adder)
    .connect(createBrowser(json))
    .connect(addReporter)
    .connect(addResolver);

  return [objectHeader, addResolver];
}
