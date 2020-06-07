import {
  Button,
  ErrorMessage,
  Heading,
  HeadingLevels,
  PageAnnouncement,
  Paragraph,
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ProgressBar from "../../../components/ProgressBar";
import getProcessRef from "../../../helpers/getProcessRef";
import persistProcessData from "../../../helpers/persistProcessData";
import stringifyArray from "../../../helpers/stringifyArray";
import { transferProcessToManager } from "../../../helpers/transferProcess";
import urlsForRouter from "../../../helpers/urlsForRouter";
import useDataValue from "../../../helpers/useDataValue";
import useOnlineWithRetry from "../../../helpers/useOnlineWithRetry";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

const SubmitPage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const online = useOnlineWithRetry();
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState();

  const residentData = useDataValue(
    Storage.ExternalContext,
    "residents",
    processRef,
    (values) => (processRef ? values[processRef] : undefined)
  );

  const address = residentData.result?.address.join(", ");
  const tenantNames = (residentData.result?.tenants || []).map(
    (tenant) => tenant.fullName
  );
  const tenants = stringifyArray(tenantNames);

  let content: React.ReactElement;

  if (online.loading) {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  } else {
    content = (
      <PageAnnouncement title="" headingLevel={HeadingLevels.H1}>
        <Heading level={HeadingLevels.H1}>Process submission pending</Heading>
        <Heading level={HeadingLevels.H2}>
          {online.result
            ? "You are online."
            : "You are currently working offline."}
        </Heading>
        {residentData.loading ? (
          "Loading..."
        ) : (
          <>
            <Paragraph>
              The Tenancy and Household Check for {tenants} at {address}, has
              been saved to your device, but still needs to be saved to your
              work tray so that you can return to it later.
            </Paragraph>
            <Paragraph>
              {online.result ? (
                <strong>
                  {" "}
                  As you are online, you can save this process to your work tray
                  now.
                </strong>
              ) : (
                <>
                  <strong>
                    You need to be online on this device to continue.
                  </strong>
                  <br />
                  <br />
                  If you can’t go online now, leave this page open in your web
                  browser. When you are next online on this device, come back to
                  this page and the ‘Save and continue later’ button will be
                  available to be clicked.
                </>
              )}
            </Paragraph>
          </>
        )}
      </PageAnnouncement>
    );
  }

  const { href, as } = urlsForRouter(
    router,
    urlObjectForSlug(router, PageSlugs.Confirmed)
  );

  const disabled =
    online.loading ||
    Boolean(online.error) ||
    !online.result ||
    submitting ||
    !href.pathname ||
    !as.pathname;

  return (
    <MainLayout title={PageTitles.Submit}>
      {online.error && (
        <ErrorMessage>
          Something went wrong while checking your online status. Please reload
          the page and try again. If the problem persists, please try reopening
          this process from your worktray.
        </ErrorMessage>
      )}

      {submitError && (
        <ErrorMessage>
          Something went wrong. Please try reopening this process from your
          worktray and submitting it again.
        </ErrorMessage>
      )}

      {content}

      {submitting && (
        <ProgressBar
          progress={progress}
          incompleteLabel={submitError ? "Error" : "Submitting..."}
          completeLabel={submitError ? "Error" : "Submitted"}
        />
      )}

      {!submitting && (
        <Button
          disabled={disabled}
          preventDoubleClick
          onClick={async (): Promise<void> => {
            if (!href.pathname || !as.pathname) {
              return;
            }

            try {
              setSubmitting(true);

              await persistProcessData(router, setProgress);
              await transferProcessToManager(router);
              sessionStorage.clear();

              await router.push(href, as);
            } catch (err) {
              console.error(err);
              setSubmitError(err);
            }
          }}
          data-testid="submit"
        >
          {disabled
            ? "Waiting for connectivity..."
            : "Save and submit to manager"}
        </Button>
      )}
    </MainLayout>
  );
};

export default SubmitPage;
