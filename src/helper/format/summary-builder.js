import { stringFormat } from '@scola/d3-string-format';

export default function formatSummaryBuilder(sname) {
  const formatAction = stringFormat('action.nav.label');
  const formatValue = stringFormat(sname);

  return (datum, index, nodes, { data, name }) => {
    if (name === 'action') {
      return formatAction(datum.name);
    }

    if (name === 'abbr') {
      if (typeof data[name] !== 'undefined') {
        return formatValue('summary.' + name, data[name]);
      }
    }

    return data[name] || null;
  };
}
