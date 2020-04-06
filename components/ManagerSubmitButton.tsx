import classNames from "classnames";
import { Button } from "lbh-frontend-react";
import { NextRouter, useRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import { ProcessStage } from "../helpers/ProcessStage";
import urlsForRouter from "../helpers/urlsForRouter";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

interface Props {
  onSubmit(router: NextRouter): Promise<void>;
  status: ProcessStage;
}

const ManagerSubmitButton: React.FunctionComponent<Props> = (props) => {
  const { onSubmit, status } = props;
  const router = useRouter();
  const buttonText = status === ProcessStage.Approved ? "Approve" : "Decline";

  const { href, as } = urlsForRouter(router, {
    ...urlObjectForSlug(router, PageSlugs.Confirmed),
    query: { status: status },
  });

  return (
    <Button
      preventDoubleClick
      className={classNames({
        "lbh-button--warning govuk-button--warning":
          status === ProcessStage.Declined,
      })}
      onClick={async (): Promise<void> => {
        if (!href.pathname || !as.pathname) {
          return;
        }

        try {
          await onSubmit(router);
        } catch (err) {
          console.error(err);
        }

        await router.push(href, as);
      }}
    >
      {buttonText}
    </Button>
  );
};

ManagerSubmitButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.oneOf([ProcessStage.Approved, ProcessStage.Declined])
    .isRequired,
};

export default ManagerSubmitButton;
