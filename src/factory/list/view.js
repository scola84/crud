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
  ListGetter,
  ListHeader
} from '../../list/view';

import {
  filterDisabler,
  formatDefaultError,
  formatListBuilder
} from '../../helper';

export default function createViewList(structure) {
  const getDisabler = new ErrorDisabler();
  const listPreparer = new ListPreparer();

  const listBuilder = new ListBuilder({
    add: false,
    format: formatListBuilder(structure.name)
  });

  const listClicker = new ListClicker({
    name: structure.name
  });

  const listDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const listGetter = new ListGetter({
    name: structure.name
  });

  const listHeader = new ListHeader({
    name: structure.name
  });

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  getDisabler
    .disable({ selector: '.body' });

  listDisabler
    .disable({
      permission: `${structure.name}.object.view`,
      selector: 'li, li .primary button'
    })
    .hide({
      permission: `${structure.name}.list.view`,
      selector: '.bar, .body'
    })
    .hide({
      permission: `${structure.name}.list.add`,
      selector: '.bar.header .right .add'
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
