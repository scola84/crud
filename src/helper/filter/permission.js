import filterDisabler from './disabler';

export default function filterPermission(permissions) {
  const filter = filterDisabler();

  return (name) => {
    const permission = permissions[name];

    return (route, data) => {
      return filter(route, data, permission);
    };
  };
}
