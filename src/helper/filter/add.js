export default function filterAdd(id) {
  return (route, data) => {
    return {
      [id]: data.data[id]
    };
  };
}
