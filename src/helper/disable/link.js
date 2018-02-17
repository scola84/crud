function disableListItem(selector) {
  return (route, data, node) => {
    return node
      .selectAll(selector)
      .selectAll('.l0:empty, .l2:empty, .l3:empty, .l4:empty, .l5:empty')
      .size() < 5;
  };
}

export default function disableLink(structure, disabler) {
  for (let i = 0; i < structure.view.link[0].fields.length; i += 1) {
    const { name, edit, view } = structure.view.link[0].fields[i];

    const editLink = [
      `${edit.permission}.add`,
      `${edit.permission}.del`,
      `${edit.permission}.edit`
    ];

    const viewLink = [
      `${edit.permission}.list`,
      `${edit.permission}.view`
    ];

    const viewObject = [
      `${view.permission}.view`,
      disableListItem(`li.${name}`)
    ];

    disabler
      .disable({
        permission: viewObject,
        selector: `li.${name}, li.${name} .primary button`
      })
      .hide({
        permission: [editLink],
        selector: `li.${name} .secondary button`
      })
      .hide({
        permission: [viewLink],
        selector: `li.${name}`
      });
  }
}
