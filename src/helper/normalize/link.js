export default function normalizeLink(structure, datum) {
  let index = 0;

  for (let i = 0; i < structure.length; i += 1) {
    const fields = structure[i].fields;

    for (let j = 0; j < fields.length; j += 1) {
      if (fields[j].name === datum.name) {
        return index;
      }

      index += 1;
    }
  }

  return -1;
}
