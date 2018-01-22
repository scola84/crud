import { json } from '@scola/codec';

import {
  ListBuilder,
  ListDisabler,
} from '@scola/gui';

import { createBrowser } from '@scola/http';

import {
  LinkClicker,
  LinkGetter
} from '../../../link/group';

import {
  disableListItem,
  filterDisabler,
  formatLinkBuilder,
} from '../../../helper';

export default function createLink(structure) {
  const linkClicker = new LinkClicker({
    name: structure.name
  });

  const linkDisabler = new ListDisabler({
    filter: filterDisabler(),
    target: 'nav-link'
  });

  const linkFinisher = new ListBuilder({
    dynamic: false,
    format: formatLinkBuilder(),
    target: 'nav-link',
    prepare: false,
    structure: structure.link
  });

  const linkGetter = new LinkGetter({
    name: structure.name
  });

  const linkPreparer = new ListBuilder({
    finish: false,
    target: 'nav-link'
  });

  for (let i = 0; i < structure.link[0].fields.length; i += 1) {
    const { name, object } = structure.link[0].fields[i];

    linkDisabler
      .disable({
        permission: [`${object}.object.view`, disableListItem(`li.${name}`)],
        selector: `li.${name}, li.${name} .primary button`
      })
      .hide({
        permission: `${structure.name}.${name}.view`,
        selector: `li.${name}`
      });
  }

  linkPreparer
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(linkFinisher)
    .connect(linkDisabler)
    .connect(linkClicker);

  return [linkPreparer, linkClicker];
}
