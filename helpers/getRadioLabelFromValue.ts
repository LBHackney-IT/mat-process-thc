export const getRadioLabelFromValue = (
  radios: { label: string; value: string }[],
  value: string
): string | undefined => {
  return radios.find((radio) => radio.value === value)?.label;
};
