export default function filterPermission(base) {
  return (local) => {
    return (request) => {
      return request.user.may(local ? base + '.' + local : base);
    };
  };
}
