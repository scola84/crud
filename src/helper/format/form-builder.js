import { stringFormat } from '@scola/d3-string-format';

export default function formatFormBuilder(sname, property = 'name') {
  const format = stringFormat(sname + '.form');

  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'value') {
      if (typeof data[datum.name] !== 'undefined') {
        return data[datum.name];
      } else if (typeof route.params[datum.name] !== 'undefined') {
        return route.params[datum.name];
      } else if (typeof datum.value !== 'undefined') {
        return datum.value;
      }
    }

    return format(name + '.' + datum[property]);
  };
}
