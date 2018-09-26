import { codec } from '@scola/codec';

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
  checkSelect,
  decideDisabler,
  filterData,
  filterDisabler,
  formatError,
  formatForm,
  formatList,
  mergeData,
  mergeOptions
} from '../helper';

export default function createSelect(structure, route) {
  checkSelect(structure, route);

  const lister = new Requester({
    id: 'crud-select-lister',
    route: route.http('list')
  });

  const listerDisabler = new ErrorDisabler({
    id: 'crud-select-lister-disabler'
  });

  const listerReporter = new ErrorReporter({
    format: formatError(route.format(), 'short'),
    id: 'crud-select-lister-reporter'
  });

  const optionsRequester = new Requester({
    id: 'crud-select-options-requester',
    route: route.http('options')
  });

  const optionsMerger = new Worker({
    id: 'crud-select-options-merger',
    merge: mergeOptions(structure)
  });

  const selectFormBuilder = new FormBuilder({
    extract: (s) => s[route.action].form.slice(0, -1),
    filter: filterData(),
    format: formatForm(route.format()),
    id: 'crud-select-form-builder',
    structure,
    target: 'form-select'
  });

  const selectFormReader = new FormReader({
    id: 'crud-select-form-reader',
    merge: mergeData(),
    serialize: { empty: false, hash: true },
    target: 'form-select'
  });

  const selectHeader = new SelectHeader({
    format: route.format(),
    id: 'crud-select-header',
    route: route.gui(),
    search: structure.search
  });

  const selectListBuilder = new ListBuilder({
    add: route.add,
    dynamic: structure.dynamic,
    extract: (s) => {
      return s[route.action].list || s[route.action].form.slice(-1);
    },
    filter: structure.filter || filterData([]),
    format: formatList(route.format('list')),
    id: 'crud-select-list-builder',
    prepare: false,
    target: 'form-select',
    render: renderForm,
    structure
  });

  const selectListClicker = new SelectClicker({
    id: 'crud-select-list-clicker',
    route: route.gui()
  });

  const selectListDisabler = new PanelDisabler({
    decide: decideDisabler(),
    filter: filterDisabler(),
    id: 'crud-select-list-disabler'
  });

  const selectListPreparer = new ListPreparer({
    dynamic: structure.dynamic,
    id: 'crud-select-list-preparer',
    search: structure.search
  });

  const selectValidator = new Validator({
    extract: (s) => s[route.action].form,
    filter: filterData(),
    id: 'crud-select-validator',
    structure
  });

  const selectValidatorReporter = new ErrorReporter({
    format: formatError(route.format()),
    id: 'crud-select-validator-reporter'
  });

  const sender = new Requester({
    id: 'crud-select-sender',
    route: route.http('send')
  });

  const sendReporter = new ErrorReporter({
    format: formatError(route.format(), 'long'),
    id: 'crud-select-send-reporter'
  });

  const sendResolver = new Resolver({
    id: 'crud-select-send-resolver',
    route: route.gui()
  });

  const union = new Worker({
    id: 'crud-select-union'
  });

  const viewer = new Requester({
    id: 'crud-select-viewer',
    route: route.http('view')
  });

  const viewDisabler = new PanelDisabler({
    decide: decideDisabler(),
    filter: filterDisabler(),
    id: 'crud-select-view-disabler'
  });

  const viewMerger = new ViewMerger({
    id: 'crud-select-view-merger'
  });

  listerDisabler
    .disable({
      selector: '.body, .bar .right'
    });

  selectListDisabler
    .disable({
      permission: route.permission('select'),
      selector: '.body, .bar .right'
    });

  viewDisabler
    .disable({
      permission: route.permission('select'),
      selector: '.body, .bar .right'
    });

  function createOptions() {
    optionsRequester
      .connect(createBrowser(...codec))
      .connect(optionsMerger);

    return [optionsRequester, optionsMerger];
  }

  function createView() {
    viewer
      .connect(createBrowser(...codec))
      .connect(viewMerger)
      .connect(viewDisabler);

    return [viewer, viewDisabler];
  }

  selectHeader
    .connect(route.options ? createOptions() : null)
    .connect(route.view ? createView() : null)
    .connect(selectListPreparer)
    .connect(lister)
    .connect(createBrowser(...codec))
    .connect(listerDisabler)
    .connect(listerReporter)
    .connect(selectFormBuilder)
    .connect(selectListBuilder)
    .connect(selectListDisabler)
    .connect(selectListClicker)
    .connect(selectFormReader)
    .connect(selectValidator)
    .connect(selectValidatorReporter)
    .connect(sender)
    .connect(createBrowser(...codec))
    .connect(sendReporter)
    .connect(sendResolver)
    .connect(union);

  return [selectHeader, union];
}
