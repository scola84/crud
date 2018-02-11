export default function filterAdd(id) {
  return (request, data) => {
    return {
      [id]: data.data.id
    };
  };
}
