export function zeroPad(num: number, place: number) {
  return String(num).padStart(place, '0');
}
