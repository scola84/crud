export default function filterDisabler() {
  return (route, data, permission) => {
    return route.user.may(permission, route, data);
  };
}
