import { stringFormat } from '@scola/d3-string-format';

export default function formatSummary(format) {
  const formatAction = stringFormat('action.panel.button');

  return (datum, index, nodes, { data, name }) => {
    if (name === 'action') {
      return formatAction(datum.name);
    }

    if (name === 'abbr') {
      if (typeof data[name] !== 'undefined') {
        return format('summary.' + name, data[name]);
      }
    }

    return data[name] || null;
  };
}
