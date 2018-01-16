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

import { LinkGetter } from '../../link/add';

import {
  LinkClicker,
  LinkHeader,
  LinkPutter,
  LinkResolver
} from '../../link/select';

import {
  filterDisabler,
  formatCheckboxError,
  formatDefaultError,
  formatListBuilder
} from '../../helper';

import createFill from './select/fill';

export default function createSelectLink(structure, link) {
  const getDisabler = new ErrorDisabler();
  const linkPreparer = new ListPreparer();

  const linkClicker = new LinkClicker({
    link: link.name,
    name: structure.name
  });

  const linkGetter = new LinkGetter({
    link: link.name,
    name: structure.name
  });

  const linkHeader = new LinkHeader({
    link: link.name,
    name: structure.name
  });

  const linkPutter = new LinkPutter({
    link: link.name,
    name: structure.name
  });

  const linkResolver = new LinkResolver({
    link: link.name,
    name: structure.name
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkFormBuilder = new FormBuilder({
    finish: false,
    target: 'form-select-link',
  });

  const linkFormReader = new FormReader({
    serialize: { empty: false, hash: true },
    target: 'form-select-link'
  });

  const linkListBuilder = new ListBuilder({
    format: formatListBuilder(),
    prepare: false,
    target: 'form-select-link',
    render: renderForm,
    structure: link.fields[0]
  });

  const linkReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const validator = new Validator({
    structure: [link.fields[0]]
  });

  const validatorReporter = new ErrorReporter({
    format: formatCheckboxError(link.name)
  });

  getDisabler
    .disable({ selector: '.body, .bar .right' });

  panelDisabler
    .hide({
      permission: structure.name + '.' + link.name + '.read',
      selector: '.body, .bar'
    });

  panelDisabler
    .connect(linkHeader);

  if (link.fill) {
    linkHeader
      .through(createFill(structure, link))
      .connect(linkPreparer);
  } else {
    linkHeader
      .connect(linkPreparer);
  }

  linkPreparer
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(linkFormBuilder)
    .connect(linkListBuilder)
    .connect(linkClicker)
    .connect(linkFormReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(linkPutter)
    .through(createBrowser(json))
    .connect(linkReporter)
    .connect(linkResolver);

  return [panelDisabler, linkResolver];
}
