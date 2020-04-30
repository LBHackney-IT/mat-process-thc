const stringifyArray = (arr: string[]): string => {
  return arr.join(", ").replace(/, ([^,]*)$/, " and $1");
};

export default stringifyArray;
