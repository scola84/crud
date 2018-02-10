import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  FormBuilder,
  FormReader,
  ListBuilder,
  ListPreparer,
  PanelDisabler,
  renderForm
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';
import { Worker } from '@scola/worker';

import {
  SelectClicker,
  SelectHeader,
  ViewMerger
} from '../select';

import {
  Requester,
  Resolver
} from '../worker';

import {
  filterDisabler,
  formatValidatorError,
  formatDefaultError,
  formatForm,
  formatList
} from '../helper';

export default function createSelect(structure, route) {
  const selector = new Requester({
    id: 'crud-selector',
    route: route.select
  });

  const selectorDisabler = new ErrorDisabler({
    id: 'crud-select-selector-disabler'
  });

  const selectorReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'short'),
    id: 'crud-select-selector-reporter'
  });

  const selectFormBuilder = new FormBuilder({
    format: formatForm(route.format()),
    id: 'crud-select-form-builder',
    structure: structure.form.slice(0, -1),
    target: 'form-select'
  });

  const selectFormReader = new FormReader({
    id: 'crud-select-form-reader',
    serialize: { empty: false, hash: true },
    target: 'form-select'
  });

  const selectHeader = new SelectHeader({
    format: route.format(),
    id: 'crud-select-header',
    route: route.header
  });

  const selectListBuilder = new ListBuilder({
    add: route.click ? true : false,
    format: formatList(route.format()),
    id: 'crud-select-list-builder',
    prepare: false,
    target: 'form-select',
    render: renderForm,
    structure: structure.form.slice(-1)
  });

  const selectListClicker = new SelectClicker({
    id: 'crud-select-clicker',
    route: route.click
  });

  const selectListDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-select-disabler'
  });

  const selectListPreparer = new ListPreparer({
    id: 'crud-select-list-preparer'
  });

  const selectValidator = new Validator({
    id: 'crud-select-validator',
    structure: structure.form
  });

  const selectValidatorReporter = new ErrorReporter({
    format: formatValidatorError(route.format()),
    id: 'crud-select-validator-reporter'
  });

  const sender = new Requester({
    id: 'crud-select-sender',
    route: route.send
  });

  const sendReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'long'),
    id: 'crud-select-send-reporter'
  });

  const sendResolver = new Resolver({
    id: 'crud-select-send-resolver',
    route: route.resolve
  });

  const union = new Worker({
    id: 'crud-select-union'
  });

  const viewer = new Requester({
    id: 'crud-select-viewer',
    route: route.view
  });

  const viewMerger = new ViewMerger({
    id: 'crud-select-view-merger'
  });

  selectorDisabler
    .disable({
      selector: '.body, .bar .right'
    });

  selectListDisabler
    .disable({
      permission: route.permission('select'),
      selector: '.body, .bar .right'
    });

  if (route.view) {
    selectHeader
      .connect(viewer)
      .connect(createBrowser(json))
      .connect(viewMerger)
      .connect(selectListPreparer);
  } else {
    selectHeader
      .connect(selectListPreparer);
  }

  selectListPreparer
    .connect(selector)
    .connect(createBrowser(json))
    .connect(selectorDisabler)
    .connect(selectorReporter)
    .connect(selectFormBuilder)
    .connect(selectListBuilder)
    .connect(selectListDisabler)
    .connect(selectListClicker)
    .connect(selectFormReader)
    .connect(selectValidator)
    .connect(selectValidatorReporter)
    .connect(sender)
    .connect(createBrowser(json))
    .connect(sendReporter)
    .connect(sendResolver)
    .connect(union);

  return [selectHeader, union];
}
