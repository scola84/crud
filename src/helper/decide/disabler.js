export default function decideDisabler() {
  return (route, data) => {
    return typeof data.meta !== 'undefined';
  };
}
