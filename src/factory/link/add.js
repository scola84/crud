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
import { Broadcaster } from '@scola/worker';

import {
  LinkGetter,
  LinkHeader,
  LinkPoster,
  LinkResolver
} from '../../link/add';

import {
  filterDisabler,
  formatCheckboxError,
  formatDefaultError,
  formatListBuilder
} from '../../helper';

export default function createAddLink(structure, link) {
  const broadcaster = new Broadcaster();
  const getDisabler = new ErrorDisabler();
  const linkPreparer = new ListPreparer();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkFormBuilder = new FormBuilder({
    finish: false,
    target: 'form-add-link',
  });

  const linkFormReader = new FormReader({
    serialize: { empty: false, hash: true },
    target: 'form-add-link'
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
    format: formatListBuilder(link.name),
    prepare: false,
    target: 'form-add-link',
    render: renderForm,
    structure: link.fields[0]
  });

  const linkPoster = new LinkPoster({
    link: link.name,
    name: structure.name
  });

  const linkResolver = new LinkResolver({
    link: link.name,
    name: structure.name
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
    format: formatCheckboxError(structure.name)
  });

  getDisabler
    .disable({ selector: '.body, .bar .right' });

  panelDisabler
    .hide({
      permission: structure.name + '.' + link.name + '.read',
      selector: '.body, .bar'
    });

  panelDisabler
    .connect(linkHeader)
    .connect(linkPreparer)
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(broadcaster);

  broadcaster
    .connect(linkFormBuilder)
    .connect(linkListBuilder)
    .connect(linkFormReader)
    .connect(validator)
    .connect(validatorReporter)
    .connect(linkPoster)
    .through(createBrowser(json))
    .connect(linkReporter)
    .connect(linkResolver);

  return [panelDisabler, linkResolver];
}
