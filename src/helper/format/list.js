import { stringFormat } from '@scola/d3-string-format';
import formatDate from './date';

export default function formatList(format) {
  const formatAdd = stringFormat('action.form.l1');
  const formatError = stringFormat('error.long');

  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'l1') {
      if (datum.name === 'empty') {
        return formatError('empty', format('value.l1.d').toLowerCase());
      } else if (datum.name === 'add') {
        return formatAdd('add', format('value.l1.0'));
      }
    }

    if (name === 'checked' && route.checked) {
      return route.checked.some((checked) => {
        return Number(checked[datum.name]) === Number(data[datum.name]);
      });
    }

    if (name === 'value') {
      return data[datum.name];
    }

    let string = typeof data[name] === 'undefined' || data[name] === null ?
      '' : format('list.' + name, data[name]);

    if (datum.date) {
      string = formatDate(datum, string);
    }

    return string;
  };
}
