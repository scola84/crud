export default function filterData(defaultValue = {}) {
  return (route, data = {}) => {
    return route.formData ? data : data.data || defaultValue;
  };
}
