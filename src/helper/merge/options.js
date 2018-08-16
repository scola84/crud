import merge from 'lodash-es/merge';

const map = {
  add: 'POST',
  clr: 'DELETE',
  del: 'DELETE',
  edit: 'PUT',
  list: 'GET',
  patch: 'PATCH',
  view: 'GET'
};

export default function mergeOptions(structure) {
  return (route, data) => {
    const options = {};
    const keys = Object.keys(map);

    let key = null;

    for (let i = 0; i < keys.length; i += 1) {
      key = keys[i];
      options[key] = data[map[key]];
    }

    route.structure = merge({}, structure, options);
  };
}
