export const PERMITTED_ALNUM = "A-z0-9\\.:_-";
export const NO_PATTERN_RE = new RegExp(`^[${PERMITTED_ALNUM}]+$`);
export const VALID_PATTERN_RE = new RegExp(`^[*?${PERMITTED_ALNUM}]+$`);

/**
 * Transforms patterns into regexes with the following logic:
 *
 * - all '?' are mapped to a single character
 * - all '*' are mapped to a 0 or more characters
 *
 * @param pattern
 * @returns
 */
export const regexFromPattern = (pattern: string): RegExp => {
  const str = String(pattern)
    .replaceAll("*", `[${PERMITTED_ALNUM}]+`)
    .replaceAll("?", `[${PERMITTED_ALNUM}]`);

  return new RegExp(`^${str}$`);
};

export const isStringLiteral = (str: string): boolean =>
  NO_PATTERN_RE.test(str);

export const isValidPattern = (str: string): boolean =>
  VALID_PATTERN_RE.test(str);
