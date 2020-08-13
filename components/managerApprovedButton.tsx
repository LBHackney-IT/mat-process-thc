import classNames from "classnames";
import { Button } from "lbh-frontend-react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import { onClickSubmit } from "../helpers/onClickSubmit";
import { ProcessStage } from "../helpers/ProcessStage";
import urlsForRouter from "../helpers/urlsForRouter";
import PageSlugs, { urlObjectForSlug } from "../steps/PageSlugs";

interface Props {
  onSubmit(): Promise<boolean>;
  status: ProcessStage;
  disabled?: boolean;
}

const ManagerApprovedButton: React.FunctionComponent<Props> = (props) => {
  const { onSubmit, status, disabled } = props;
  const router = useRouter();
  const buttonText = status === ProcessStage.Approved ? "Accept process" : "";

  const { href, as } = urlsForRouter(router, {
    ...urlObjectForSlug(router, PageSlugs.Confirmed),
    query: { status: status },
  });

  return (
    <Button
      preventDoubleClick
      disabled={disabled}
      className={classNames({
        "lbh-button govuk-button": status === ProcessStage.Approved,
      })}
      onClick={async (): Promise<void> => {
        await onClickSubmit(router, href, as, onSubmit);
      }}
    >
      {buttonText}
    </Button>
  );
};

ManagerApprovedButton.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  status: PropTypes.oneOf([ProcessStage.Approved]).isRequired,
  disabled: PropTypes.bool,
};

export default ManagerApprovedButton;
