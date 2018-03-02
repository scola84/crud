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
  filterDisabler,
  formatValidatorError,
  formatDefaultError,
  formatForm,
  formatList
} from '../helper';

export default function createSelect(structure, route) {
  const lister = new Requester({
    id: 'crud-lister',
    route: route.http('list')
  });

  const listerDisabler = new ErrorDisabler({
    id: 'crud-select-lister-disabler'
  });

  const listerReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'short'),
    id: 'crud-select-lister-reporter'
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
    route: route.gui(),
    search: structure.search
  });

  const selectListBuilder = new ListBuilder({
    add: route.add,
    dynamic: structure.dynamic,
    filter: structure.filter,
    format: formatList(route.format('list')),
    id: 'crud-select-list-builder',
    prepare: false,
    target: 'form-select',
    render: renderForm,
    structure: structure.list || structure.form.slice(-1)
  });

  const selectListClicker = new SelectClicker({
    id: 'crud-select-clicker',
    route: route.gui()
  });

  const selectListDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-select-disabler'
  });

  const selectListPreparer = new ListPreparer({
    dynamic: structure.dynamic,
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
    route: route.http('send')
  });

  const sendReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'long'),
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

  if (route.view) {
    selectHeader
      .connect(viewer)
      .connect(createBrowser(...codec))
      .connect(viewMerger)
      .connect(selectListPreparer);
  } else {
    selectHeader
      .connect(selectListPreparer);
  }

  selectListPreparer
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
