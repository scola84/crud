import { stringFormat } from '@scola/d3-string-format';

export default function formatSummary(format) {
  const formatAction = stringFormat('action.panel.button');

  return (datum, index, nodes, { data, name }) => {
    if (name === 'action') {
      return formatAction(datum.name);
    }

    return typeof data[name] === 'undefined' || data[name] === null ?
      null : format('summary.' + name, data[name]);
  };
}
