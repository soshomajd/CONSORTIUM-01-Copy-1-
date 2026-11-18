/** Localize display text without changing identifiers, links, or copied values. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9\u0660-\u0669]/g, digit => {
    const code = digit.charCodeAt(0);
    return String.fromCharCode(0x06f0 + (code >= 0x0660 ? code - 0x0660 : code - 0x30));
  });
}
