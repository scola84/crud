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
import { Worker } from '@scola/worker';
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
  formatError,
  formatForm,
  mergeData,
  mergeOptions
} from '../helper';

export default function createAdd(structure, route) {
  const adder = new Requester({
    id: 'crud-adder',
    route: route.http('add')
  });

  const addBuilder = new FormBuilder({
    extract: (s) => s.add.form,
    format: formatForm(route.format()),
    id: 'crud-add-builder',
    structure,
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
    format: formatError(route.format(), 'long'),
    id: 'crud-add-reporter'
  });

  const addResolver = new Resolver({
    filter: filterAdd(route.id),
    id: 'crud-add-resolver',
    route: route.gui()
  });

  const addValidator = new Validator({
    extract: (s) => s.add.form,
    filter: filterData(),
    id: 'crud-add-validator',
    structure
  });

  const addValidatorReporter = new ErrorReporter({
    format: formatError(route.format()),
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

  const optionsRequester = new Requester({
    id: 'crud-add-options-requester',
    route: route.http('options')
  });

  const optionsMerger = new Worker({
    id: 'crud-add-options-merger',
    merge: mergeOptions(structure)
  });

  objectDisabler
    .disable({
      permission: route.permission('add'),
      selector: '.body, .bar .right'
    });

  disableForm(structure.add, addDisabler);

  function createOptions() {
    optionsRequester
      .connect(createBrowser(...codec))
      .connect(optionsMerger);

    return [optionsRequester, optionsMerger];
  }

  objectHeader
    .connect(route.options ? createOptions() : null)
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
