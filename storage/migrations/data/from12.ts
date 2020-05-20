export default <
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [s: string]: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    residents: { [s: string]: { carer: any } };
  }
>(
  processData: T
): T => {
  for (const resident of Object.values(processData.residents)) {
    const { month, year } = resident.carer.liveInStartDate as {
      month?: number;
      year?: number;
    };
    resident.carer.liveInStartDate = [
      month === undefined ? `month: ${month}` : "",
      year === undefined ? `year: ${year}` : "",
    ].join(" / ");
  }
  return processData;
};
