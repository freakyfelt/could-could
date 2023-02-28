export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((val) => arr2.includes(val));
}

export function disjoint<T>(arr1: T[], arr2: T[]): [T[], T[]] {
  const intersect = intersection(arr1, arr2);

  return [
    arr1.filter((val) => !intersect.includes(val)),
    arr2.filter((val) => !intersect.includes(val)),
  ];
}
