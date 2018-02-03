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

export default function createEdit(structure, route) {
  const broadcaster = new Broadcaster({
    id: 'crud-edit-broadcaster'
  });

  const deleter = new Requester({
    id: 'crud-deleter',
    route: route.del
  });

  const deleteBuilder = new FormBuilder({
    format: formatForm(route.format('action'), 'label'),
    id: 'crud-edit-delete-builder',
    target: 'form-delete',
    structure: structure.del && structure.del.form.slice(0, -1)
  });

  const deleteDisabler = new FormDisabler({
    filter: filterDisabler(),
    id: 'crud-edit-delete-disabler',
    target: 'form-delete'
  });

  const deleteReader = new FormReader({
    id: 'crud-edit-delete-reader'
  });

  const editor = new Requester({
    id: 'crud-editor',
    route: route.edit
  });

  const editBuilder = new FormBuilder({
    format: formatForm(route.format()),
    id: 'crud-edit-builder',
    target: 'form-edit',
    structure: structure.edit.form
  });

  const editDisabler = new FormDisabler({
    filter: filterDisabler(),
    id: 'crud-edit-disabler',
    target: 'form-edit'
  });

  const editReader = new FormReader({
    id: 'crud-edit-reader'
  });

  const editValidator = new Validator({
    id: 'crud-edit-validator',
    structure: structure.edit.form
  });

  const editValidatorReporter = new ErrorReporter({
    format: formatValidatorError(route.format()),
    id: 'crud-edit-validator-reporter'
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-edit-object-disabler'
  });

  const objectHeader = new ObjectHeader({
    format: route.format(),
    id: 'crud-edit-object-header',
    route: route.header
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError('long'),
    id: 'crud-edit-object-reporter'
  });

  const objectResolver = new ObjectResolver({
    id: 'crud-edit-object-resolver'
  });

  const undeleter = new Requester({
    id: 'crud-edit-undeleter',
    route: route.del
  });

  const undeleteBuilder = new FormBuilder({
    format: formatForm(route.format('action'), 'label'),
    id: 'crud-edit-undelete-builder',
    target: 'form-undelete',
    structure: structure.del && structure.del.form
  });

  const undeleteReader = new FormReader({
    id: 'crud-edit-undelete-reader'
  });

  const viewer = new Requester({
    id: 'crud-edit-viewer',
    route: route.view
  });

  const viewDisabler = new ErrorDisabler({
    id: 'crud-edit-view-disabler'
  });

  const viewReporter = new ErrorReporter({
    format: formatDefaultError('short'),
    id: 'crud-edit-view-reporter'
  });

  deleteDisabler
    .disable({
      permission: route.permission('delete'),
      selector: 'input'
    });

  editDisabler
    .disable({
      permission: route.permission('edit'),
      selector: 'input'
    });

  objectDisabler
    .hide({
      permission: route.permission('view'),
      selector: '.body, .bar'
    });

  viewDisabler
    .disable({ selector: '.body' });

  objectHeader
    .connect(objectDisabler)
    .connect(viewer)
    .through(createBrowser(json))
    .connect(viewDisabler)
    .connect(viewReporter)
    .connect(broadcaster);

  broadcaster
    .connect(editBuilder)
    .connect(editDisabler)
    .connect(editReader)
    .connect(editValidator)
    .connect(editValidatorReporter)
    .connect(editor)
    .through(createBrowser(json))
    .connect(objectReporter);

  if (structure.del) {
    broadcaster
      .connect(deleteBuilder)
      .connect(deleteDisabler)
      .connect(deleteReader)
      .connect(deleter)
      .through(createBrowser(json))
      .connect(objectReporter);

    broadcaster
      .connect(undeleteBuilder)
      .connect(undeleteReader)
      .connect(undeleter)
      .through(createBrowser(json))
      .connect(objectReporter);
  }

  objectReporter
    .connect(objectResolver);

  return [objectHeader, objectResolver];
}
