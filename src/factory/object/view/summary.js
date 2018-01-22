import {
  PanelDisabler,
  SummaryBuilder
} from '@scola/gui';

import {
  ObjectClicker,
} from '../../../object/view';

import {
  filterDisabler,
  formatSummaryBuilder
} from '../../../helper';

export default function createSummary(structure) {
  const objectBuilder = new SummaryBuilder({
    format: formatSummaryBuilder(structure.name),
    structure: structure.object.summary
  });

  const objectClicker = new ObjectClicker({
    name: structure.name
  });

  const objectDisabler = new PanelDisabler({
    filter: filterDisabler()
  });

  objectDisabler
    .hide({
      permission: `${structure.name}.object.edit`,
      selector: '.actions .edit'
    });

  objectBuilder
    .connect(objectDisabler)
    .connect(objectClicker);

  return [objectBuilder, objectClicker];
}
