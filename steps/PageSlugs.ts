enum PageSlugs {
  // General
  Index = "",
  Loading = "loading",
  Sections = "sections",

  // Previsit
  VisitAttempt = "visit-attempt",
  StartCheck = "start-check",
  AboutVisit = "about-visit",

  // ID, residency, and tenant information
  PresentForCheck = "present-for-check",
  Verify = "verify",
  Id = "id",
  Residency = "residency",
  TenantPhoto = "tenant-photo",
  NextOfKin = "next-of-kin",
  Carer = "carer",
  OtherSupport = "other-support",

  // Household
  Household = "household",
  OtherProperty = "other-property",
  Rent = "rent",

  // Property inspection
  AboutProperty = "about-property",
  Rooms = "rooms",
  LaminatedFlooring = "laminated-flooring",
  StructuralChanges = "structural-changes",
  Damage = "damage",
  Roof = "roof",
  Loft = "loft",
  Garden = "garden",
  Repairs = "repairs",
  StoringMaterials = "storing-materials",
  FireExit = "fire-exit",
  SmokeAlarm = "smoke-alarm",
  MetalGates = "metal-gates",
  DoorMats = "door-mats",
  CommunalAreas = "communal-areas",
  Pets = "pets",
  AntisocialBehaviour = "antisocial-behaviour",
  OtherComments = "other-comments",

  // Wellbeing support
  HomeCheck = "home-check",
  Health = "health",
  Disability = "disability",
  SupportNeeds = "support-needs",

  // Review and submit
  Review = "review",
  Submit = "submit",
  Confirmed = "confirmed"
}

export const urlObjectForSlug = (slug: PageSlugs): { pathname: string } => ({
  pathname: `/${slug}`
});

export default PageSlugs;
