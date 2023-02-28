export const pathExists = <T extends Record<string, unknown>>(
  obj: T,
  path: string | string[]
): boolean => {
  if (typeof obj !== "object") return false;

  const pathArray = Array.isArray(path) ? path : path.split(".");

  // Find value
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && (prevObj?.[key] as any),
    obj
  );
  return typeof result !== "undefined";
};
