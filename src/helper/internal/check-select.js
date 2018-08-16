export default function checkSelect(structure, route) {
  if (typeof structure[route.action] === 'undefined') {
    console.warn(`Structure for ${route.action} does not exist`,
      structure, route);
  }
}
