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
    id: 'crud-list-builder',
    structure: structure.list && structure.list.list
  });

  const listClicker = new ListClicker({
    id: 'crud-list-clicker',
    route: route.gui()
  });

  const listDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-list-disabler'
  });

  const listHeader = new ListHeader({
    format: route.format(),
    id: 'crud-list-header',
    route: route.gui()
  });

  const listPreparer = new ListPreparer({
    height: structure.list.height,
    id: 'crud-list-preparer'
  });

  const lister = new Requester({
    id: 'crud-lister',
    route: route.http('list')
  });

  const listerDisabler = new ErrorDisabler({
    id: 'crud-list-lister-disabler'
  });

  const listerReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'short'),
    id: 'crud-lister-reporter'
  });

  listerDisabler
    .disable({
      selector: '.body, .bar .right'
    });

  listDisabler
    .disable({
      permission: route.permission('list'),
      selector: '.body, .bar .right'
    })
    .disable({
      permission: route.permission('view'),
      selector: 'li, li .primary button'
    })
    .hide({
      permission: route.permission('add'),
      selector: '.bar.header .right .add'
    })
    .hide({
      permission: route.permission('edit'),
      selector: 'li .secondary .button'
    })
    .hide({
      permission: route.permission('del'),
      selector: '.bar.header .right .delete'
    });

  listHeader
    .connect(listPreparer)
    .connect(lister)
    .connect(createBrowser(json))
    .connect(listerDisabler)
    .connect(listerReporter)
    .connect(listBuilder)
    .connect(listDisabler)
    .connect(listClicker);

  return [listHeader, listClicker];
}
