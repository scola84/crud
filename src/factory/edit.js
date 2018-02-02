import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  FormBuilder,
  FormDisabler,
  FormReader,
  PanelDisabler
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';
import { Broadcaster } from '@scola/worker';

import {
  ObjectHeader,
  ObjectResolver
} from '../edit';

import {
  Requester
} from '../worker';

import {
  filterDisabler,
  formatDefaultError,
  formatForm,
  formatValidatorError
} from '../helper';

export default function createEdit(structure, route, helper) {
  const broadcaster = new Broadcaster();
  const deleteReader = new FormReader();
  const getDisabler = new ErrorDisabler();
  const objectResolver = new ObjectResolver();
  const putReader = new FormReader();
  const undeleteReader = new FormReader();

  const deleteBuilder = new FormBuilder({
    format: formatForm(helper.format('action'), 'label'),
    target: 'form-delete',
    structure: structure.del && structure.del.form.slice(0, -1)
  });

  const deleteDisabler = new FormDisabler({
    filter: filterDisabler(),
    target: 'form-delete'
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const objectDeleter = new Requester({
    route: route.deleter
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const objectGetter = new Requester({
    route: route.getter
  });

  const objectHeader = new ObjectHeader({
    format: helper.format(),
    route: route.header
  });

  const objectPutter = new Requester({
    route: route.putter
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const objectUndeleter = new Requester({
    route: route.deleter
  });

  const putBuilder = new FormBuilder({
    format: formatForm(helper.format()),
    target: 'form-edit',
    structure: structure.edit.form
  });

  const putDisabler = new FormDisabler({
    filter: filterDisabler(),
    target: 'form-edit'
  });

  const undeleteBuilder = new FormBuilder({
    format: formatForm(helper.format('action'), 'label'),
    target: 'form-undelete',
    structure: structure.del && structure.del.form
  });

  const validator = new Validator({
    structure: structure.edit.form
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(helper.format())
  });

  deleteDisabler
    .disable({
      permission: helper.permission('delete'),
      selector: 'input'
    });

  getDisabler
    .disable({ selector: '.body' });

  objectDisabler
    .hide({
      permission: helper.permission('view'),
      selector: '.body, .bar'
    });

  putDisabler
    .disable({
      permission: helper.permission('edit'),
      selector: 'input'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(objectGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(broadcaster);

  broadcaster
    .connect(putBuilder)
    .connect(putDisabler)
    .connect(putReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(objectPutter)
    .through(createBrowser(json))
    .connect(objectReporter);

  if (structure.del) {
    broadcaster
      .connect(deleteBuilder)
      .connect(deleteDisabler)
      .connect(deleteReader)
      .connect(objectDeleter)
      .through(createBrowser(json))
      .connect(objectReporter);

    broadcaster
      .connect(undeleteBuilder)
      .connect(undeleteReader)
      .connect(objectUndeleter)
      .through(createBrowser(json))
      .connect(objectReporter);
  }

  objectReporter
    .connect(objectResolver);

  return [objectHeader, objectResolver];
}
