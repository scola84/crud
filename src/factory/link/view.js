import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  ListBuilder,
  ListPreparer,
  PanelDisabler
} from '@scola/gui';

import { createBrowser } from '@scola/http';

import {
  LinkClicker,
  LinkGetter,
  LinkHeader
} from '../../link/view';

import {
  filterDisabler,
  formatDefaultError,
  formatListBuilder
} from '../../helper';

export default function createViewLink(structure, link) {
  const getDisabler = new ErrorDisabler();
  const linkPreparer = new ListPreparer();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkBuilder = new ListBuilder({
    add: false,
    format: formatListBuilder(link.name),
    structure: link.actions.view
  });

  const linkClicker = new LinkClicker({
    name: structure.name,
    link: link.name
  });

  const linkGetter = new LinkGetter({
    name: structure.name,
    link: link.name
  });

  const linkHeader = new LinkHeader({
    name: structure.name,
    link: link.name
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  getDisabler
    .disable({ selector: '.body' });

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
    .connect(linkBuilder)
    .connect(linkClicker);

  return [panelDisabler, linkClicker];
}
