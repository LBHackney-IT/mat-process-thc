export default (): void => {
  // We don't remove the `id`, `residency`, or `tenants` stores,
  // which were removed from the schema with this version, to guard
  // against data loss.
};
