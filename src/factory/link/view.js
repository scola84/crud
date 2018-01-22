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
    link: link.object
  });

  const linkDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const linkGetter = new LinkGetter({
    name: structure.name,
    link: link.name
  });

  const linkHeader = new LinkHeader({
    name: structure.name,
    link: link.name
  });

  getDisabler
    .disable({ selector: '.body' });

  linkDisabler
    .disable({
      permission: `${link.object}.object.view`,
      selector: `li.${link.name}, li.${link.name} .primary button`
    })
    .hide({
      permission: `${structure.name}.${link.name}.add`,
      selector: '.header .add'
    })
    .hide({
      permission: `${structure.name}.${link.name}.del`,
      selector: '.header .delete'
    })
    .hide({
      permission: `${structure.name}.${link.name}.view`,
      selector: '.body, .bar'
    })
    .hide({
      permission: `${structure.name}.${link.name}.edit`,
      selector: `li.${link.name} .secondary .button`
    });

  linkHeader
    .connect(linkPreparer)
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(linkBuilder)
    .connect(linkDisabler)
    .connect(linkClicker);

  return [linkHeader, linkClicker];
}
