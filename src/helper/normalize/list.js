export default function normalizeList(datum, index, nodes, options = {}) {
  const selector = options.disabled === false ?
    'li:not(.disabled)' : 'li';

  const list = nodes[index].closest('div.list-group');
  const items = Array.from(list.querySelectorAll(selector));
  const item = nodes[index].closest('li');

  for (let i = 0; i < items.length; i += 1) {
    if (items[i] === item) {
      index = i;
      break;
    }
  }

  return index;
}
