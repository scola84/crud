import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  PanelDisabler,
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Broadcaster, Worker } from '@scola/worker';

import {
  ObjectGetter,
  ObjectHeader
} from '../../object/view';

import {
  filterDisabler,
  formatDefaultError,
} from '../../helper';

import createLink from './view/link';
import createSummary from './view/summary';

export default function createViewObject(structure) {
  const broadcaster = new Broadcaster();
  const getDisabler = new ErrorDisabler();
  const union = new Worker();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
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

  panelDisabler
    .hide({
      permission: `${structure.name}.object.read`,
      selector: '.body, .bar'
    });

  panelDisabler
    .connect(objectHeader)
    .connect(objectGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(broadcaster);

  if (structure.object.summary) {
    broadcaster
      .through(createSummary(structure))
      .connect(union);
  }

  if (structure.link) {
    broadcaster
      .through(createLink(structure))
      .connect(union);
  }

  return [panelDisabler, union];
}
