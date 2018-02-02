import { json } from '@scola/codec';

import {
  ErrorDisabler,
  ErrorReporter,
  ListBuilder,
  ListDisabler,
  PanelDisabler,
  SummaryBuilder
} from '@scola/gui';

import { createBrowser } from '@scola/http';
import { Broadcaster, Worker } from '@scola/worker';

import {
  LinkClicker,
  ObjectHeader,
  SummaryClicker
} from '../view';

import {
  Requester
} from '../worker';

import {
  disableLink,
  filterDisabler,
  filterLink,
  formatDefaultError,
  formatLink,
  formatSummary
} from '../helper';

export default function createView(structure, route, helper) {
  const broadcaster = new Broadcaster();
  const getDisabler = new ErrorDisabler();
  const union = new Worker();

  const getReporter = new ErrorReporter({
    format: formatDefaultError('short')
  });

  const linkDisabler = new ListDisabler({
    filter: filterDisabler(),
    target: 'nav-link'
  });

  const linkBuilder = new ListBuilder({
    dynamic: false,
    filter: filterLink(),
    format: formatLink(),
    target: 'nav-link',
    structure: structure.view.link
  });

  const linkClicker = new LinkClicker({
    route: route.link
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  const objectGetter = new Requester({
    route: route.getter
  });

  const objectHeader = new ObjectHeader({
    format: helper.format()
  });

  const summaryBuilder = new SummaryBuilder({
    format: formatSummary(helper.format()),
    structure: structure.view.summary
  });

  const summaryClicker = new SummaryClicker({
    route: route.summary
  });

  const summaryDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  getDisabler
    .disable({ selector: '.body' });

  objectDisabler
    .hide({
      permission: helper.permission('view'),
      selector: '.body, .bar'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(objectGetter)
    .through(createBrowser(json))
    .connect(getDisabler)
    .connect(getReporter)
    .connect(broadcaster);

  if (structure.view.summary) {
    broadcaster
      .connect(summaryBuilder)
      .connect(summaryDisabler)
      .connect(summaryClicker)
      .connect(union);
  }

  if (structure.view.link) {
    disableLink(structure, linkDisabler);

    broadcaster
      .connect(linkBuilder)
      .connect(linkDisabler)
      .connect(linkClicker)
      .connect(union);
  }

  return [objectHeader, union];
}
