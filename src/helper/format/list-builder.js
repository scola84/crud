import { stringFormat } from '@scola/d3-string-format';

export default function formatListBuilder(sname) {
  const formatAdd = stringFormat('action.form.l1');
  const formatError = stringFormat('error.long');
  const formatName = stringFormat(sname);

  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'l1') {
      if (datum.name === 'empty') {
        return formatError('empty', formatName('nav.l1.d').toLowerCase());
      } else if (datum.name === 'add') {
        return formatAdd('add', formatName('nav.l1.0'));
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
