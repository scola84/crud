import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  FormBuilder,
  FormReader,
  ListBuilder,
  PanelDisabler,
  renderList
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Validator } from '@scola/validator';

import {
  LinkClicker,
  LinkGetter,
  LinkHeader,
  LinkPutter,
  LinkResolver
} from '../../link/edit';

import {
  filterDisabler,
  formatValidatorError,
  formatDefaultError,
  formatFormBuilder,
  formatListBuilder
} from '../../helper';

export default function createEditLink(structure, link) {
  const getDisabler = new ErrorDisabler();

  const linkClicker = new LinkClicker({
    link: link.object,
    name: structure.name
  });

  const linkDisabler = new PanelDisabler({
    filter: filterDisabler()
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

  const linkFormPreparer = new FormBuilder({
    finish: false,
    target: 'form-edit-link',
  });

  const linkFormBuilder = new FormBuilder({
    filter: (route, data) => data[0],
    format: formatFormBuilder(link.name),
    prepare: false,
    structure: link.actions.edit,
    target: 'form-edit-link'
  });

  const linkFormReader = new FormReader({
    serialize: { empty: false, hash: true },
    target: 'form-edit-link'
  });

  const linkListBuilder = new ListBuilder({
    format: formatListBuilder(link.name),
    render: renderList,
    structure: [{ fields: [{ dir: 'rtl' }] }]
  });

  const linkReporter = new ErrorReporter({
    format: formatDefaultError('long')
  });

  const validator = new Validator({
    structure: link.actions.edit
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(link.name)
  });

  getDisabler
    .disable({ selector: '.body, .bar .right' });

  linkDisabler
    .disable({
      permission: `${link.object}.object.view`,
      selector: '.list li, .list li button'
    })
    .hide({
      permission: `${structure.name}.${link.name}.add`,
      selector: '.body, .bar'
    });

  linkHeader
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(linkFormPreparer)
    .connect(linkFormBuilder)
    .connect(linkListBuilder)
    .connect(linkDisabler)
    .connect(linkClicker)
    .connect(linkFormReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(linkPutter)
    .through(createBrowser(json))
    .connect(linkReporter)
    .connect(linkResolver);

  return [linkHeader, linkResolver];
}
