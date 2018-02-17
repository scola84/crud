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

    if (name === 'state') {
      const state = datum.state.filter((value, power) => {
        return (data.state & (2 ** power)) !== 0;
      });

      return state.length ? state.join(' ') : 'empty';
    }

    const value = typeof data[name] === 'undefined' ||
      data[name] === null ? '' : data[name];

    return format('list.' + name, value) || null;
  };
}
