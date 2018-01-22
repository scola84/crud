import { json } from '@scola/codec';

import {
  ErrorReporter,
  FormBuilder,
  FormReader,
  PanelDisabler
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';

import {
  ObjectHeader,
  ObjectPoster,
  ObjectResolver
} from '../../object/add';

import {
  filterDisabler,
  formatDefaultError,
  formatFormBuilder,
  formatValidatorError
} from '../../helper';

export default function createAddObject(structure) {
  const objectReader = new FormReader();

  const objectBuilder = new FormBuilder({
    format: formatFormBuilder(structure.name),
    target: 'form-add',
    structure: [structure.object.add]
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const objectHeader = new ObjectHeader({
    name: structure.name
  });

  const objectPoster = new ObjectPoster({
    name: structure.name
  });

  const objectReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const objectResolver = new ObjectResolver({
    name: structure.name
  });

  const validator = new Validator({
    structure: [structure.object.form]
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(structure.name)
  });

  objectDisabler
    .hide({
      permission: `${structure.name}.list.add`,
      selector: '.body, .bar'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(objectBuilder)
    .connect(objectReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(objectPoster)
    .through(createBrowser(json))
    .connect(objectReporter)
    .connect(objectResolver);

  return [objectHeader, objectResolver];
}
