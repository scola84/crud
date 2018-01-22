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
  formatDefaultError,
  formatValidatorError,
  formatListBuilder
} from '../../helper';

export default function createAddLink(structure, link) {
  const broadcaster = new Broadcaster();
  const getDisabler = new ErrorDisabler();
  const linkPreparer = new ListPreparer();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkDisabler = new PanelDisabler({
    filter: filterDisabler()
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
    link: link.object,
    name: structure.name
  });
  const linkHeader = new LinkHeader({
    link: link.name,
    name: structure.name
  });

  const linkListBuilder = new ListBuilder({
    format: formatListBuilder(link.object),
    prepare: false,
    target: 'form-add-link',
    render: renderForm,
    structure: link.actions.add
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

  const validator = new Validator({
    structure: link.actions.add
  });

  const validatorReporter = new ErrorReporter({
    format: formatValidatorError(structure.name)
  });

  getDisabler
    .disable({ selector: '.body, .bar .right' });

  linkDisabler
    .hide({
      permission: `${structure.name}.${link.name}.add`,
      selector: '.body, .bar'
    });

  linkHeader
    .connect(linkDisabler)
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

  return [linkHeader, linkResolver];
}
