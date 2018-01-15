import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  NavBuilder,
  NavDisabler,
  PanelDisabler,
  SummaryBuilder
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Broadcaster, Worker } from '@scola/worker';

import {
  LinkClicker,
  LinkGetter
} from '../../link/group';

import {
  ObjectClicker,
  ObjectGetter,
  ObjectHeader
} from '../../object/view';

import {
  disableListItem,
  filterDisabler,
  formatDefaultError,
  formatLinkBuilder,
  formatSummaryBuilder
} from '../../helper';

export default function createViewObject(structure) {
  const broadcaster = new Broadcaster();
  const getDisabler = new ErrorDisabler();
  const union = new Worker();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkClicker = new LinkClicker({
    name: structure.name
  });

  const linkDisabler = new NavDisabler({
    filter: filterDisabler(),
    target: 'nav-link'
  });

  const linkFinisher = new NavBuilder({
    format: formatLinkBuilder(),
    target: 'nav-link',
    prepare: false,
    structure: structure.link
  });

  const linkGetter = new LinkGetter({
    name: structure.name
  });

  const linkPreparer = new NavBuilder({
    finish: false,
    target: 'nav-link'
  });

  const objectBuilder = new SummaryBuilder({
    format: formatSummaryBuilder(),
    structure: structure.object.summary
  });

  const objectClicker = new ObjectClicker({
    name: structure.name
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const objectHeader = new ObjectHeader({
    name: structure.name
  });

  const objectGetter = new ObjectGetter({
    name: structure.name
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  getDisabler
    .disable({ selector: '.body' });

  objectDisabler
    .hide({
      permission: `${structure.name}.object.write`,
      selector: '.actions .edit'
    });

  panelDisabler
    .hide({
      permission: `${structure.name}.object.read`,
      selector: '.body, .bar'
    });

  structure.link[0].fields.forEach(({ name }) => {
    linkDisabler
      .disable({
        permission: [`${name}.object.read`, disableListItem(`li.${name}`)],
        selector: `li.${name}, li.${name} .primary button`
      })
      .hide({
        permission: `${structure.name}.${name}.write`,
        selector: `li.${name} .secondary .button`
      })
      .hide({
        permission: `${structure.name}.${name}.read`,
        selector: `li.${name}`
      });
  });

  panelDisabler
    .connect(objectHeader)
    .connect(objectGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(broadcaster);

  broadcaster
    .connect(objectBuilder)
    .connect(objectDisabler)
    .connect(objectClicker)
    .connect(union);

  broadcaster
    .connect(linkPreparer)
    .connect(linkGetter)
    .through(createBrowser(json))
    .connect(linkFinisher)
    .connect(linkDisabler)
    .connect(linkClicker)
    .connect(union);

  return [panelDisabler, union];
}
