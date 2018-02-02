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

import {
  Requester
} from '../worker';

import {
  filterDisabler,
  formatDefaultError,
  formatList
} from '../helper';

export default function createList(structure, route, helper) {
  const getDisabler = new ErrorDisabler();
  const listPreparer = new ListPreparer();

  const listBuilder = new ListBuilder({
    add: false,
    format: formatList(helper.format())
  });

  const listClicker = new ListClicker({
    route: route.clicker
  });

  const listDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const listGetter = new Requester({
    route: route.getter
  });

  const listHeader = new ListHeader({
    format: helper.format(),
    route: route.header
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  getDisabler
    .disable({ selector: '.body' });

  listDisabler
    .disable({
      permission: helper.permission('view'),
      selector: 'li, li .primary button'
    })
    .hide({
      permission: helper.permission('add'),
      selector: '.bar.header .right .add'
    })
    .hide({
      permission: helper.permission('delete'),
      selector: '.bar.header .right .delete'
    })
    .hide({
      permission: helper.permission('list'),
      selector: '.bar, .body'
    });

  listHeader
    .connect(listPreparer)
    .connect(listGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(listBuilder)
    .connect(listDisabler)
    .connect(listClicker);

  return [listHeader, listClicker];
}
