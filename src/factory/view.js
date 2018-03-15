import { codec } from '@scola/codec';

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
  decideRequester,
  disableLink,
  filterData,
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
    format: formatLink(structure.view.link),
    id: 'crud-view-link-builder',
    target: 'link-list',
    structure: structure.view.link
  });

  const linkClicker = new LinkClicker({
    id: 'crud-view-link-clicker',
    route: route.gui(),
    structure: structure.view.link
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-view-object-disabler'
  });

  const objectHeader = new ObjectHeader({
    format: route.format(),
    id: 'crud-view-object-header',
    route: route.gui(),
    structure: structure.view.header
  });

  const summaryBuilder = new SummaryBuilder({
    filter: filterData(),
    format: formatSummary(route.format()),
    id: 'crud-view-summary-builder',
    structure: structure.view.summary
  });

  const summaryClicker = new SummaryClicker({
    id: 'crud-view-summary-clicker',
    route: route.gui()
  });

  const summaryDisabler = new PanelDisabler({
    filter: filterDisabler(),
    id: 'crud-view-summary-disabler'
  });

  const union = new Worker({
    id: 'crud-view-union'
  });

  const viewer = new Requester({
    decide: decideRequester(route.id),
    id: 'crud-viewer',
    route: route.http('view')
  });

  const viewDisabler = new ErrorDisabler({
    id: 'crud-view-disabler'
  });

  const viewReporter = new ErrorReporter({
    format: formatDefaultError(route.format(), 'short'),
    id: 'crud-view-reporter'
  });

  viewDisabler
    .disable({
      selector: '.body'
    });

  objectDisabler
    .disable({
      permission: route.permission('view'),
      selector: '.body'
    });

  objectHeader
    .connect(objectDisabler)
    .connect(viewer)
    .connect(createBrowser(...codec))
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
