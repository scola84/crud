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
  CheckerMerger,
  SelectClicker,
  SelectHeader,
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

export default function createSelect(structure, route, helper) {
  const checkerMerger = new CheckerMerger();
  const getDisabler = new ErrorDisabler();
  const selectPreparer = new ListPreparer();
  const union = new Worker();

  const checkerGetter = new Requester({
    route: route.checker
  });

  const selectClicker = new SelectClicker({
    route: route.clicker
  });

  const selectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const selectGetter = new Requester({
    route: route.getter
  });

  const selectHeader = new SelectHeader({
    format: helper.format(),
    route: route.header
  });

  const selectResolver = new Resolver({
    route: route.resolver
  });

  const selectSender = new Requester({
    route: route.sender
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const selectFormPreparer = new FormBuilder({
    finish: false,
    target: 'form-select',
  });

  const selectFormBuilder = new FormBuilder({
    format: formatForm(helper.format()),
    prepare: false,
    structure: structure.form.slice(0, -1),
    target: 'form-select'
  });

  const selectFormReader = new FormReader({
    serialize: { empty: false, hash: true },
    target: 'form-select'
  });

  const selectBuilder = new ListBuilder({
    format: formatList(helper.format()),
    prepare: false,
    target: 'form-select',
    render: renderForm,
    structure: structure.form.slice(-1)
  });

  const selectReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const validator = new Validator({
    structure: structure.form
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(helper.format())
  });

  getDisabler
    .disable({ selector: '.body, .bar .right' });

  selectDisabler
    .hide({
      permission: helper.permission(),
      selector: '.body, .bar'
    });

  if (route.checker) {
    selectHeader
      .connect(checkerGetter)
      .through(createBrowser(json))
      .connect(checkerMerger)
      .connect(selectPreparer);
  } else {
    selectHeader
      .connect(selectPreparer);
  }

  selectPreparer
    .connect(selectGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(selectFormPreparer)
    .connect(selectFormBuilder)
    .connect(selectBuilder)
    .connect(selectDisabler)
    .connect(selectClicker)
    .connect(selectFormReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(selectSender)
    .through(createBrowser(json))
    .connect(selectReporter)
    .connect(selectResolver)
    .connect(union);

  return [selectHeader, union];
}
