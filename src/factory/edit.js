import { json } from '@scola/codec';
import { stringFormat } from '@scola/d3-string-format';

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
  decideRequester,
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
    route: route.http('del')
  });

  const deleteBuilder = new FormBuilder({
    format: formatForm(stringFormat('action'), 'label'),
    id: 'crud-edit-delete-builder',
    target: 'form-delete',
    structure: structure.del && structure.del.form.slice(0, 2)
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
    route: route.http('edit')
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
    route: route.gui()
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'long'),
    id: 'crud-edit-object-reporter'
  });

  const objectResolver = new ObjectResolver({
    id: 'crud-edit-object-resolver',
    route: route.gui()
  });

  const undeleter = new Requester({
    id: 'crud-edit-undeleter',
    route: route.http('del')
  });

  const undeleteBuilder = new FormBuilder({
    format: formatForm(stringFormat('action'), 'label'),
    id: 'crud-edit-undelete-builder',
    target: 'form-undelete',
    structure: structure.del && structure.del.form.slice(1)
  });

  const undeleteReader = new FormReader({
    id: 'crud-edit-undelete-reader'
  });

  const viewer = new Requester({
    decide: decideRequester(route.id),
    id: 'crud-edit-viewer',
    route: route.http('view')
  });

  const viewDisabler = new ErrorDisabler({
    id: 'crud-edit-view-disabler'
  });

  const viewReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'short'),
    id: 'crud-edit-view-reporter'
  });

  deleteDisabler
    .disable({
      permission: route.permission('del'),
      selector: 'input'
    });

  editDisabler
    .disable({
      permission: route.permission('edit'),
      selector: 'input'
    });

  objectDisabler
    .disable({
      permission: route.permission('view'),
      selector: '.body, .bar .right'
    });

  viewDisabler
    .disable({
      selector: '.body, .bar .right'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(viewer)
    .connect(createBrowser(json))
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
    .connect(createBrowser(json))
    .connect(objectReporter);

  if (structure.del) {
    broadcaster
      .connect(deleteBuilder)
      .connect(deleteDisabler)
      .connect(deleteReader)
      .connect(deleter)
      .connect(createBrowser(json))
      .connect(objectReporter);

    broadcaster
      .connect(undeleteBuilder)
      .connect(undeleteReader)
      .connect(undeleter)
      .connect(createBrowser(json))
      .connect(objectReporter);
  }

  objectReporter
    .connect(objectResolver);

  return [objectHeader, objectResolver];
}
