import { stringFormat } from '@scola/d3-string-format';

export default function formatSummary(format) {
  const formatAction = stringFormat('action.panel.button');

  return (datum, index, nodes, { data, name, route }) => {
    if (name === 'action') {
      return formatAction(datum.name);
    }

    if (name === 'state') {
      const state = datum.state.filter((value, power) => {
        return (data.state & (2 ** power)) !== 0;
      });

      return state.length ? state.join(' ') : 'empty';
    }

    const value = typeof data[name] === 'undefined' ||
      data[name] === null ? (typeof datum[name] === 'undefined' ?
        '' : datum[name]) : data[name];

    return format('summary.' + name, value, route, data) || null;
  };
}
