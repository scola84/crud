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
  ListClicker,
  ListHeader
} from '../list';

import { Requester } from '../worker';

import {
  filterDisabler,
  formatDefaultError,
  formatList
} from '../helper';

export default function createList(structure, route) {
  const listBuilder = new ListBuilder({
    add: false,
    format: formatList(route.format()),
    id: 'crud-list-builder'
  });

  const listClicker = new ListClicker({
    id: 'crud-list-clicker',
    route: route.click
  });

  const listDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-list-disabler'
  });

  const listHeader = new ListHeader({
    format: route.format(),
    id: 'crud-list-header',
    route: route.header
  });

  const listPreparer = new ListPreparer({
    id: 'crud-list-preparer'
  });

  const lister = new Requester({
    id: 'crud-lister',
    route: route.list
  });

  const listerDisabler = new ErrorDisabler({
    id: 'crud-list-lister-disabler'
  });

  const listerReporter = new ErrorReporter({
    format: formatDefaultError('short'),
    id: 'crud-lister-reporter'
  });

  listerDisabler
    .disable({ selector: '.body' });

  listDisabler
    .disable({
      permission: route.permission('view'),
      selector: 'li, li .primary button'
    })
    .hide({
      permission: route.permission('add'),
      selector: '.bar.header .right .add'
    })
    .hide({
      permission: route.permission('delete'),
      selector: '.bar.header .right .delete'
    })
    .hide({
      permission: route.permission('list'),
      selector: '.bar, .body'
    });

  listHeader
    .connect(listPreparer)
    .connect(lister)
    .through(createBrowser(json))
    .connect(listerDisabler)
    .connect(listerReporter)
    .connect(listBuilder)
    .connect(listDisabler)
    .connect(listClicker);

  return [listHeader, listClicker];
}
