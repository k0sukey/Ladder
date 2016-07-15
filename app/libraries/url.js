export function encode(params) {
  let result = [];
  for (let key in params) {
    result.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  }
  return result.join('&');
}