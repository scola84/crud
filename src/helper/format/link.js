import { stringFormat } from '@scola/d3-string-format';

export default function formatLink() {
  return (datum, index, nodes, { data, name }) => {
    const prefix = datum.name + '.title';
    const value = data && data[index] || {};

    const link = Object.assign({}, value, {
      count: value.count ? value.count - 1 : 0,
      l2: value.l1 || '',
      l3: value.l1 || ''
    });

    if (name === 'l2' && link.count < 1) {
      return null;
    }

    return stringFormat(prefix)(name, link);
  };
}
