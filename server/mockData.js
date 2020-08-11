const mockProcessData = {
  request: { processRef: "8a465289-515d-ea11-a811-000d3a0ba110" },
  processData: {
    _id: "8a465289-515d-ea11-a811-000d3a0ba110",
    processType: { value: 100000156, name: "Tenancy and household check" },
    dateCreated: "2020-03-03T13:19:00.4909825Z",
    dateLastModified: "2020-06-08T14:23:12.112Z",
    dateCompleted: "0001-01-01T00:00:00Z",
    processDataAvailable: true,
    dataSchemaVersion: 12,
    processStage: "Not completed",
    linkedProcessId: null,
    preProcessData: {},
    processData: {
      submitted: "2020-07-28T15:57:36.952Z",
      property: { outside: { images: [] }, metalGates: { images: [] } },
      isVisitInside: { value: "yes" },
      tenantsPresent: [
        "aca34650-7857-e811-8126-70106faa6a31",
        "b2a34650-7857-e811-8126-70106faa6a31",
      ],
      household: {
        documents: { images: [] },
        memberChanges: {
          notes: [
            {
              value: "dnw.qd",
              isPostVisitAction: true,
              createdAt: "2020-05-27T08:19:41.748Z",
            },
          ],
        },
        houseMovingSchemes: {
          notes: [
            {
              value: "sjql;",
              isPostVisitAction: true,
              createdAt: "2020-05-27T08:19:40.192Z",
            },
          ],
        },
        rentArrears: { notes: [] },
        housingBenefits: {},
        incomeOfficer: {},
        otherProperty: {},
      },
      other: { notes: [{ value: "", isPostVisitAction: false }] },
      unableToEnter: {
        thirdFailedAttempt: {
          reasons: [],
          actions: [],
          needsAppointmentLetterReminder: true,
          date: "2020-05-14T14:14:48.591Z",
          appointmentLetterReminderCreatedAt: "2020-05-18T15:11:15.433Z",
        },
        firstFailedAttempt: {
          value: ["tenant not in"],
          notes: "note1",
          date: "2020-05-18T15:11:08.137Z",
        },
        secondFailedAttempt: {
          value: ["not safe"],
          notes: "notw2",
          date: "2020-05-18T15:12:15.408Z",
        },
        fourthFailedAttempt: {
          reasons: ["subletting"],
          needsFraudInvestigationReminder: true,
          needsFraudInvestigationLetterReminder: true,
          date: "2020-05-18T15:15:58.777Z",
          fraudInvestigationLetterReminderCreatedAt: "2020-05-18T15:16:32.458Z",
          fraudInvestigationReminderCreatedAt: "2020-05-19T09:41:40.291Z",
        },
        otherNotes: "",
      },
      residents: {
        "aca34650-7857-e811-8126-70106faa6a31": {
          id: { type: "valid passport", images: [], notes: [] },
          residency: { type: "payslip", images: [], notes: [] },
          photo: { isWilling: "yes", images: [] },
          nextOfKin: { fullName: "hdkal" },
          carer: { hasCarer: "no" },
          otherSupport: { fullName: "jkl" },
          signature: "",
        },
        "b2a34650-7857-e811-8126-70106faa6a31": {
          id: { type: "valid passport", images: [], notes: [] },
          residency: { type: "residence permit", images: [], notes: [] },
          photo: { isWilling: "yes", images: [] },
          nextOfKin: { fullName: "njkl" },
          carer: { hasCarer: "no" },
          otherSupport: {
            notes: "notegp",
            fullName: "mzsl",
            role: "person",
            phoneNumber: "07833109098",
          },
          signature: "",
        },
      },
    },
    postProcessData: {},
  },
  generatedAt: "2020-08-04T10:46:01.5652331+00:00",
};

// /v1/residents
const mockResidentsData = {
  results: [
    {
      contactId: "123456-1f56-e811-812e-70106faa6a11",
      emailAddress: "testing@yahoo.co.uk",
      uprn: "1000000000",
      addressLine1: "FLAT 66 TEST COURT",
      addressLine2: "THE TERRACE",
      addressLine3: "HACKNEY",
      firstName: "Test Testing",
      lastName: "Testore",
      fullName: " Test Testing Testore",
      larn: "LARN1700027",
      telephone1: "01234567891",
      telephone2: null,
      telephone3: "01234567891",
      cautionaryAlert: false,
      propertyCautionaryAlert: false,
      houseRef: null,
      title: "Miss",
      fullAddressDisplay:
        " FLAT 66 TEST COURT \r THE TERRACE\r\nHACKNEY\r\nLONDON E2 2LN",
      fullAddressSearch: "flat66testcourttheterrace",
      postCode: "E2 2LN",
      dateOfBirth: null,
      hackneyHomesId: "211111",
      disabled: false,
      relationship: "Person 1",
      extendedrelationship: null,
      responsible: true,
      age: "26",
    },
  ],
};

const mockTenanciesData = {
  results: {
    propertyReferenceNumber: "0001234",
    benefit: "0",
    tagReferenceNumber: "01234/01",
    accountid: "412333-129f-1234-1234-70106faa4841",
    currentBalance: "-553.95",
    rent: "102.59",
    housingReferenceNumber: "000123",
    directdebit: null,
    personNumber: "b6e72c28-7957-e811-8126-70106faa6a31",
    responsible: false,
    title: null,
    forename: null,
    surname: null,
    tenuretype: "Secure",
    tenancyStartDate: "2020-07-28T11:34:21.319Z",
    startDate: "2020-07-28T11:34:21.319Z",
  },
};

module.exports = {
  mockProcessData,
  mockResidentsData,
  mockTenanciesData,
};
