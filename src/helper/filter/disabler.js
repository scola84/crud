export default function filterDisabler() {
  return (route, data, permission) => {
    if (typeof permission === 'string' || Array.isArray(permission)) {
      return route.user.may(permission);
    }

    if (typeof permission === 'function') {
      return permission(route, data);
    }

    if (typeof permission.scope !== 'undefined') {
      let found = false;

      const scope = data && data.meta && data.meta.scope ||
        data && data.data && data.data.scope;

      for (let i = 0; i < permission.scope.length; i += 1) {
        found = found || scope === permission.scope[i];
      }

      return route.user.may(permission.name) && found;
    }

    return route.user.may(permission.name);
  };
}
