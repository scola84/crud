export default function decideRequester(id) {
  return (request) => {
    if (typeof request.params[id] === 'undefined') {
      throw new Error('select');
    }

    return true;
  };
}
