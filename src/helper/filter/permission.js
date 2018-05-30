export default function filterPermission(permission) {
  return (name) => {
    return (route, data) => {
      return typeof permission[name] === 'function' ?
        permission[name](route, data) :
        route.user.may(permission[name]);
    };
  };
}
