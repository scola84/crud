import { stringFormat } from '@scola/d3-string-format';
import normalizeList from '../normalize/list';

export default function formatLink() {
  return (datum, index, nodes, { data, name }) => {
    index = normalizeList(datum, index, nodes);

    const prefix = (datum.format || datum.name) + '.title';
    const value = data && data[index] || {};

    const link = Object.assign({}, value, {
      count: value.count ? value.count - 1 : 0,
      l2: value.l5 || '',
      l3: value.l5 || '',
      l4: value.l5 || '',
      l5: value.l5 || ''
    });

    if (name === 'l3' && link.count < 1) {
      return null;
    }

    if (name === 'l5' && link.l5 === '') {
      return null;
    }

    return stringFormat(prefix)(name, link);
  };
}
