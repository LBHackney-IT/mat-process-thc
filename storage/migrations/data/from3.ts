export default <
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [s: string]: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otherNotes: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    residents: { [s: string]: any };
  }
>(
  processData: T
): T => {
  delete processData.id;
  delete processData.residency;
  delete processData.tenant;

  return processData;
};
