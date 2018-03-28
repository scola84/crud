export default function disableSummary(structure, disabler) {
  for (let i = 0; i < structure.view.summary.actions.length; i += 1) {
    const { name, permission } = structure.view.summary.actions[i];

    disabler
      .hide({
        permission,
        selector: `li.${name}`
      });
  }
}
