import { codec } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  FormBuilder,
  FormDisabler,
  FormReader,
  PanelDisabler,
  ResultReporter
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';
import { Worker } from '@scola/worker';
import { CallHeader } from '../call';

import {
  Requester
} from '../worker';

import {
  disableForm,
  filterData,
  filterDisabler,
  formatError,
  formatForm,
  formatResult,
  mergeData,
  mergeOptions
} from '../helper';

export default function createCall(structure, route) {
  const caller = new Requester({
    id: 'crud-caller',
    route: route.http('call')
  });

  const callBuilder = new FormBuilder({
    extract: (s) => s.call.form,
    format: formatForm(route.format('call')),
    id: 'crud-call-builder',
    structure,
    target: 'form-call'
  });

  const callDisabler = new FormDisabler({
    filter: filterDisabler(),
    id: 'crud-call-disabler',
    target: 'form-call'
  });

  const callReader = new FormReader({
    id: 'crud-call-reader',
    merge: mergeData()
  });

  const callErrorReporter = new ErrorReporter({
    format: formatError(route.format('call'), 'long'),
    id: 'crud-call-error-reporter'
  });

  const callHeader = new CallHeader({
    format: route.format('call'),
    id: 'crud-call-header'
  });

  const callResultReporter = new ResultReporter({
    filter: filterData(),
    format: formatResult(route.format('call'), 'long'),
    id: 'crud-call-result-reporter'
  });

  const callValidator = new Validator({
    extract: (s) => s.call.form,
    filter: filterData(),
    id: 'crud-call-validator',
    structure
  });

  const callValidatorReporter = new ErrorReporter({
    format: formatError(route.format('call')),
    id: 'crud-call-validator-reporter'
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-call-object-disabler'
  });

  const optionsRequester = new Requester({
    id: 'crud-call-options-requester',
    route: route.http('options')
  });

  const optionsMerger = new Worker({
    id: 'crud-call-options-merger',
    merge: mergeOptions(structure)
  });

  const viewDisabler = new ErrorDisabler({
    id: 'crud-call-view-disabler'
  });

  const viewReporter = new ErrorReporter({
    format: formatError(route.format('call'), 'short'),
    id: 'crud-call-view-reporter'
  });

  objectDisabler
    .disable({
      permission: route.permission('call'),
      selector: '.body, .bar .right'
    });

  viewDisabler
    .disable({
      selector: '.body, .bar .right'
    });

  disableForm(structure.call, callDisabler);

  function createOptions() {
    optionsRequester
      .connect(createBrowser(...codec))
      .connect(optionsMerger);

    return [optionsRequester, optionsMerger];
  }

  callHeader
    .connect(route.options ? createOptions() : null)
    .connect(objectDisabler)
    .connect(viewDisabler)
    .connect(viewReporter)
    .connect(callBuilder)
    .connect(callDisabler)
    .connect(callReader)
    .connect(callValidator)
    .connect(callValidatorReporter)
    .connect(caller)
    .connect(createBrowser(...codec))
    .connect(callErrorReporter)
    .connect(callResultReporter);

  return [callHeader, callResultReporter];
}
