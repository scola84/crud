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

export default function createView(structure, route) {
  const broadcaster = new Broadcaster({
    id: 'crud-view-broadcaster'
  });

  const linkDisabler = new ListDisabler({
    filter: filterDisabler(),
    id: 'crud-view-link-disabler',
    target: 'link-list'
  });

  const linkBuilder = new ListBuilder({
    dynamic: false,
    filter: filterLink(),
    format: formatLink(),
    id: 'crud-view-link-builder',
    target: 'link-list',
    structure: structure.view.link
  });

  const linkClicker = new LinkClicker({
    id: 'crud-view-link-clicker',
    route: route.link
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-view-object-disabler'
  });

  const objectHeader = new ObjectHeader({
    format: route.format(),
    id: 'crud-view-object-header'
  });

  const summaryBuilder = new SummaryBuilder({
    format: formatSummary(route.format()),
    id: 'crud-view-summary-builder',
    structure: structure.view.summary
  });

  const summaryClicker = new SummaryClicker({
    id: 'crud-view-summary-clicker',
    route: route.summary
  });

  const summaryDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-view-summary-disabler'
  });

  const union = new Worker({
    id: 'crud-view-union'
  });

  const viewer = new Requester({
    id: 'crud-viewer',
    route: route.view
  });

  const viewDisabler = new ErrorDisabler({
    id: 'crud-view-disabler'
  });

  const viewReporter = new ErrorReporter({
    format: formatDefaultError('short'),
    id: 'crud-view-reporter'
  });

  viewDisabler
    .disable({ selector: '.body' });

  objectDisabler
    .hide({
      permission: route.permission('view'),
      selector: '.body, .bar'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(viewer)
    .through(createBrowser(json))
    .connect(viewDisabler)
    .connect(viewReporter)
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
