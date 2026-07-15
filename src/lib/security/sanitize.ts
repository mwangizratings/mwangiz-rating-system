const CONTROL_CHARACTERS_EXCEPT_NEW_LINES = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeComment(comment: string) {
  return comment
    .replace(CONTROL_CHARACTERS_EXCEPT_NEW_LINES, "")
    .replace(/\r\n/g, "\n")
    .trim();
}
