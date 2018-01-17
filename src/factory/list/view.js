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
  const disabler = new ErrorDisabler();
  const preparer = new ListPreparer();

  const builder = new ListBuilder({
    add: false,
    format: formatListBuilder(structure.name)
  });

  const clicker = new ListClicker({
    name: structure.name
  });

  const getter = new ListGetter({
    name: structure.name
  });

  const header = new ListHeader({
    name: structure.name
  });

  const panelDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const reporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  disabler
    .disable({ selector: '.body' });

  panelDisabler
    .hide({
      permission: structure.name + '.object.write',
      selector: '.bar.header .right .add'
    });

  panelDisabler
    .connect(header)
    .connect(preparer)
    .connect(getter)
    .through(createBrowser(json))
    .connect(disabler)
    .connect(reporter)
    .connect(builder)
    .connect(clicker);

  return [panelDisabler, clicker];
}
