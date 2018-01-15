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
  ObjectDeleter,
  ObjectGetter,
  ObjectHeader,
  ObjectPutter,
  ObjectResolver
} from '../../object/edit';

import {
  filterDisabler,
  formatDefaultError,
  formatFormBuilder,
  formatValidatorError
} from '../../helper';

import local from '../../structure';

export default function createEditObject(structure) {
  const broadcaster = new Broadcaster();
  const deleteReader = new FormReader();
  const getDisabler = new ErrorDisabler();
  const putReader = new FormReader();
  const undeleteReader = new FormReader();

  const deleteBuilder = new FormBuilder({
    format: formatFormBuilder('action', 'label'),
    target: 'form-delete',
    structure: [...local.del, structure.object.id]
  });

  const deleteDisabler = new FormDisabler({
    filter: filterDisabler(),
    target: 'form-delete'
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const objectDeleter = new ObjectDeleter({
    name: structure.name
  });

  const objectGetter = new ObjectGetter({
    name: structure.name
  });

  const objectHeader = new ObjectHeader({
    name: structure.name
  });

  const objectPutter = new ObjectPutter({
    name: structure.name
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const objectResolver = new ObjectResolver({
    name: structure.name
  });

  const objectUndeleter = new ObjectDeleter({
    name: structure.name
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const putBuilder = new FormBuilder({
    format: formatFormBuilder(structure.name),
    target: 'form-edit',
    structure: [structure.object.form, structure.object.id]
  });

  const putDisabler = new FormDisabler({
    filter: filterDisabler(),
    target: 'form-edit'
  });

  const undeleteBuilder = new FormBuilder({
    format: formatFormBuilder('action', 'label'),
    target: 'form-undelete',
    structure: [...local.undel, structure.object.id]
  });

  const validator = new Validator({
    structure: [structure.object.form, structure.object.id]
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(structure.name)
  });

  deleteDisabler
    .disable({
      permission: structure.name + '.object.write',
      selector: 'input'
    });

  getDisabler
    .disable({ selector: '.body' });

  panelDisabler
    .hide({
      permission: structure.name + '.object.write',
      selector: '.body, .bar'
    });

  putDisabler
    .disable({
      permission: structure.name + '.object.write',
      selector: 'input'
    });

  panelDisabler
    .connect(objectHeader)
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

  objectReporter
    .connect(objectResolver);

  return [panelDisabler, objectResolver];
}
