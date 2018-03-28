function disableListItem(selector) {
  return (route, data, node) => {
    return node
      .selectAll(selector)
      .selectAll('.l0:empty, .l2:empty, .l3:empty, .l4:empty, .l5:empty')
      .size() < 5;
  };
}

export default function disableLink(structure, disabler) {
  let link = null;

  for (let i = 0; i < structure.view.link.length; i += 1) {
    link = structure.view.link[i];

    for (let j = 0; j < link.fields.length; j += 1) {
      const { name, edit, permission, view } = link.fields[j];

      const editLink = [
        `${edit.permission}.add`,
        `${edit.permission}.del`,
        `${edit.permission}.edit`,
        `${edit.permission}.list`
      ];

      const viewLink = [
        `${edit.permission}.list`,
        `${edit.permission}.view`
      ];

      const viewObject = view ? [
        `${view.permission}.view`,
        disableListItem(`li.${name}`)
      ] : '';

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

      if (permission) {
        disabler
          .hide({
            permission,
            selector: `li.${name}`
          });
      }
    }
  }
}
