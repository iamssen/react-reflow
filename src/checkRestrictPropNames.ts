const restrictedPropNames: string[] = ['children', 'parentStore'];

export const checkRestrictedPropNames = (obj, errorMessage: (propName: string, restrictedPropNames: string[]) => string) => {
  const propName: string = restrictedPropNames.find(name => obj[name] !== undefined);
  if (typeof propName === 'string') throw new Error(errorMessage(propName, restrictedPropNames));
}