export default function formatError(format) {
  return (datum, index, nodes, { data, route }) => {
    return format('result.' + data.code, data, route, data);
  };
}
