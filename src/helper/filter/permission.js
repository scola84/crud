export default function filterPermission(permissions) {
  return (name) => {
    return (route, data) => {
      return route.user.may(permissions[name], route, data);
    };
  };
}
