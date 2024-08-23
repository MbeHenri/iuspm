export function copyMap<K, V>(map: Map<K, V>) {
  var aux = new Map<K, V>();
  map.forEach((value, key) => aux.set(key, value));
  return aux;
}
