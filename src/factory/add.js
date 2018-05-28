import { codec } from '@scola/codec';

import {
  ErrorReporter,
  FormBuilder,
  FormDisabler,
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
  disableForm,
  filterAdd,
  filterData,
  filterDisabler,
  formatDefaultError,
  formatForm,
  formatValidatorError,
  mergeData
} from '../helper';

export default function createAdd(structure, route) {
  const adder = new Requester({
    id: 'crud-adder',
    route: route.http('add')
  });

  const addBuilder = new FormBuilder({
    format: formatForm(route.format()),
    id: 'crud-add-builder',
    structure: structure.add.form,
    target: 'form-add'
  });

  const addDisabler = new FormDisabler({
    filter: filterDisabler(),
    id: 'crud-add-disabler',
    target: 'form-add'
  });

  const addReader = new FormReader({
    id: 'crud-add-reader',
    merge: mergeData()
  });

  const addReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'long'),
    id: 'crud-add-reporter'
  });

  const addResolver = new Resolver({
    filter: filterAdd(route.id),
    id: 'crud-add-resolver',
    route: route.gui()
  });

  const addValidator = new Validator({
    filter: filterData(),
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
    id: 'crud-add-object-header',
    route: route.gui()
  });

  objectDisabler
    .disable({
      permission: route.permission('add'),
      selector: '.body, .bar .right'
    });

  disableForm(structure.add, addDisabler);

  objectHeader
    .connect(objectDisabler)
    .connect(addBuilder)
    .connect(addDisabler)
    .connect(addReader)
    .connect(addValidator)
    .connect(addValidatorReporter)
    .connect(adder)
    .connect(createBrowser(...codec))
    .connect(addReporter)
    .connect(addResolver);

  return [objectHeader, addResolver];
}
