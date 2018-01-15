export default function disableListItem(selector) {
  return (route, data, node) => {
    return node
      .selectAll(selector)
      .selectAll('.primary span:empty, .secondary span:empty')
      .size() < 2;
  };
}
