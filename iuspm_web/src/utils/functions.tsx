import { format } from "date-fns";

import { fr } from "date-fns/locale";

export function copyMap<K, V>(map: Map<K, V>) {
  var aux = new Map<K, V>();
  map.forEach((value, key) => aux.set(key, value));
  return aux;
}

export function formatDate(date: Date, withHour = false): string {
  return format(date, withHour ? "d MMMM yyyy : HH'h' mm" : "d MMMM yyyy", {
    locale: fr,
  });
}
