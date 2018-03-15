export default function mergeData() {
  return (route, data) => {
    return route.formData ? data : { data };
  };
}
