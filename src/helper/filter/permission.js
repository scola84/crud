export default function filterPermission(permission) {
  return (name) => {
    return (request) => {
      return request.user.may(permission[name]);
    };
  };
}
