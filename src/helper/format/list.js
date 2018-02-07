import formatDate from './date';

export default function formatList(format) {
  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'checked') {
      return (route.checked || []).some((checked) => {
        return Number(checked[datum.name]) === Number(data[datum.name]);
      });
    }

    if (name === 'value') {
      return data[datum.name];
    }

    if (name === 'l1') {
      if (datum.name === 'empty') {
        return format('list.empty');
      } else if (datum.name === 'add') {
        return format('list.add');
      }
    }

    let string = typeof data[name] === 'undefined' || data[name] === null ?
      '' : format('list.' + name, data[name]);

    if (datum.date) {
      string = formatDate(datum, string);
    }

    return string;
  };
}
