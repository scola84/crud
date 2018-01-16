import { stringFormat } from '@scola/d3-string-format';

export default function formatListBuilder() {
  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'l1') {
      if (datum.name === 'empty') {
        return stringFormat('error.long')('empty');
      } else if (datum.name === 'add') {
        return stringFormat('action.nav.label')('add');
      }
    }

    if (name === 'checked' && route.checked) {
      return route.checked.some((link) => {
        return Number(link[datum.name]) === Number(data[datum.name]);
      });
    }

    if (name === 'value') {
      return data[datum.name];
    }

    return data[name];
  };
}
