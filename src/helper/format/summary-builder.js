import { stringFormat } from '@scola/d3-string-format';

export default function formatSummaryBuilder() {
  return (datum, index, nodes, { data, name }) => {
    if (name === 'action') {
      return stringFormat('action.nav.label')(datum.name);
    }

    return data[name] || null;
  };
}
