import formatDate from './date';

export default function formatFormBuilder(format, property = 'name') {
  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'value') {
      let value = null;

      if (typeof data[datum.name] !== 'undefined') {
        value = data[datum.name];
      }

      if (typeof route.params[datum.name] !== 'undefined') {
        value = route.params[datum.name];
      }

      if (typeof datum.value !== 'undefined') {
        value = datum.value;
      }

      if (value !== null) {
        return datum.date ? formatDate(datum, value) : value;
      }
    }

    return format('form.' + name + '.' + datum[property]);
  };
}
