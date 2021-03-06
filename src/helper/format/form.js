export default function formatForm(format) {
  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'data') {
      return data;
    }

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

      return datum.type === 'plain' ||
        datum.type === 'submit' ||
        datum.type === 'file' ?
        format('form.value.' + datum.name, value, route, data) :
        value;
    }

    if (datum.type === 'select') {
      if (name.name === 'selected') {
        return name.value === data[datum.name];
      } else if (name.name === 'text') {
        return format('form.value.' + datum.name + '.' + name.value);
      }
    }

    if (datum.type === 'checkbox') {
      if (name === 'checked') {
        return datum.value === data[datum.name];
      }
    }

    if (typeof datum[name] !== 'undefined') {
      return format('form.value.' + name, datum[name], route, data);
    }

    const code = 'form.' + name + (datum.name ? '.' + datum.name : '');

    return format(code, datum, index, nodes);
  };
}
