import getProcessRef from "helpers/getProcessRef";
import idFromSlug from "helpers/idFromSlug";
import useDataValue from "helpers/useDataValue";
import { Paragraph } from "lbh-frontend-react";
import { useRouter } from "next/router";
import React from "react";
import Storage from "../storage/Storage";

export const CurrentTenantNames: React.FunctionComponent = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const idBeingVerified = idFromSlug(router, slug);

  const processRef = getProcessRef(router);

  const tenants = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef]?.tenants : undefined)
  );

  const tenantsValue = tenants.result || [];

  const idToDisplay = tenantsValue.find(({ id }) => id === idBeingVerified);
  const showName = idToDisplay?.fullName;

  return (
    <Paragraph>
      <strong> Tenant being verified: {showName} </strong>
    </Paragraph>
  );
};
