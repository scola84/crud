import { timeFormat } from 'd3';

export default function formatDate(datum, string) {
  string = String(string);
  const dates = string.match(/(\d+)/g) || [];

  for (let i = 0; i < dates.length; i += 1) {
    string = string.replace(dates[i],
      timeFormat(datum.date)(new Date(Number(dates[i]))));
  }

  return string;
}
