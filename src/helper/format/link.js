import { stringFormat } from '@scola/d3-string-format';
import normalizeLink from '../normalize/link';

export default function formatLink(structure) {
  return (datum, index, nodes, { data, name }) => {
    index = normalizeLink(structure, datum);

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
