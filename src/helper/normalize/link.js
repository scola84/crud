export default function normalizeLink(datum, index, nodes) {
  const list = nodes[index].closest('div.list');
  const items = Array.from(list.querySelectorAll('li'));
  const item = nodes[index].closest('li');

  for (let i = 0; i < items.length; i += 1) {
    if (items[i] === item) {
      index = i;
      break;
    }
  }

  return index;
}
