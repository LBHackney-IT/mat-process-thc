export const getCheckboxLabelsFromValues = (
  checkboxes: { label: string; value: string }[],
  values: string[]
): string => {
  return checkboxes
    .filter(({ value }) => values.includes(value))
    .map(({ label }) => label)
    .join(", ");
};
