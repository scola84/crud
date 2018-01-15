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

import {
  LinkDeleter,
  LinkGetter,
  LinkHeader,
  LinkResolver
} from '../../link/delete';

import {
  filterDisabler,
  formatCheckboxError,
  formatDefaultError,
  formatListBuilder
} from '../../helper';

export default function createDeleteLink(structure, link) {
  const getDisabler = new ErrorDisabler();
  const linkPreparer = new ListPreparer();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkDeleter = new LinkDeleter({
    link: link.name,
    name: structure.name
  });

  const linkFormBuilder = new FormBuilder({
    finish: false,
    target: 'form-delete-link'
  });

  const linkFormReader = new FormReader({
    serialize: { empty: false, hash: true },
    target: 'form-delete-link'
  });

  const linkGetter = new LinkGetter({
    link: link.name,
    name: structure.name
  });

  const linkHeader = new LinkHeader({
    link: link.name,
    name: structure.name
  });

  const linkListBuilder = new ListBuilder({
    add: false,
    format: formatListBuilder(),
    prepare: false,
    target: 'form-delete-link',
    render: renderForm,
    structure: link
  });

  const linkReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const linkResolver = new LinkResolver({
    link: link.name,
    name: structure.name
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const validator = new Validator({
    structure: structure.link
  });

  const validatorReporter = new ErrorReporter({
    format: formatCheckboxError(link.name)
  });

  getDisabler
    .disable({ selector: '.body' });

  panelDisabler
    .hide({
      permission: structure.name + '.' + link.name + '.write',
      selector: '.body, .bar'
    });

  panelDisabler
    .connect(linkHeader)
    .connect(linkPreparer)
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(linkFormBuilder)
    .connect(linkListBuilder)
    .connect(linkFormReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(linkDeleter)
    .through(createBrowser(json))
    .connect(linkReporter)
    .connect(linkResolver);

  return [panelDisabler, linkResolver];
}
