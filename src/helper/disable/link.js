function disableListItem(selector) {
  return (route, data, node) => {
    return node
      .selectAll(selector)
      .selectAll('.primary span:empty, .secondary span:empty')
      .size() < 2;
  };
}

export default function disableLink(structure, disabler) {
  for (let i = 0; i < structure.view.link[0].fields.length; i += 1) {
    const { name, edit, view } = structure.view.link[0].fields[i];

    disabler
      .disable({
        permission: [
          `${view.auth}.view`,
          disableListItem(`li.${name}`)
        ],
        selector: `li.${name}, li.${name} .primary button`
      })
      .hide({
        permission: [
          [`${edit.auth}.add`, `${edit.auth}.del`, `${edit.auth}.edit`]
        ],
        selector: `li.${name} .secondary button`
      })
      .hide({
        permission: [
          [`${edit.auth}.list`, `${edit.auth}.view`]
        ],
        selector: `li.${name}`
      });
  }
}
