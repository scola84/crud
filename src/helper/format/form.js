export default function formatForm(format, property = 'name') {
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
        value = typeof datum.value === 'function' ?
          datum.value(route, data) : datum.value;
      }

      if (value !== null) {
        return datum.type === 'plain' ?
          format('form.value.' + datum.name, value) :
          value;
      }
    }

    if (datum.type === 'select') {
      if (name.name === 'selected') {
        return name.value === data[datum.name];
      } else if (name.name === 'text') {
        return format('form.value.' + datum.name + '.' + name.value);
      }
    }

    if (typeof datum[name] !== 'undefined') {
      return format('form.value.' + name, datum[name]);
    }

    return format('form.' + name + '.' + datum[property], datum);
  };
}
