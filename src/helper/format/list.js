export default function formatList(format) {
  return (datum, index, nodes, { data, name, route }) => {
    if (datum.name === 'empty') {
      return name === 'l1' ? format('list.empty') : null;
    } else if (datum.name === 'add') {
      return name === 'l1' ? format('list.add') : null;
    }

    if (name === 'checked') {
      return (route.checked || []).some((checked) => {
        return Number(checked[datum.name]) === Number(data[datum.name]);
      });
    }

    if (name === 'value') {
      if (typeof datum.value !== 'undefined') {
        return datum.value;
      }

      return data[datum.name];
    }

    if (name === 'state') {
      const state = datum.state.filter((value, power) => {
        return (data.state & (2 ** power)) !== 0;
      });

      return state.length ? state.join(' ') : 'empty';
    }

    const value = typeof data[name] === 'undefined' ||
      data[name] === null ? datum[name] || '' : data[name];

    return format('list.' + name, value, route, data) || null;
  };
}
