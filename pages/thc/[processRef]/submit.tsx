import {
  Button,
  ErrorMessage,
  PageAnnouncement,
  Paragraph
} from "lbh-frontend-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ProgressBar from "../../../components/ProgressBar";
import persistProcessData from "../../../helpers/persistProcessData";
import urlsForRouter from "../../../helpers/urlsForRouter";
import useOnlineWithRetry from "../../../helpers/useOnlineWithRetry";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";

const SubmitPage: NextPage = () => {
  const router = useRouter();
  const online = useOnlineWithRetry();
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState();

  const address = "1 Mare Street, London, E8 3AA";
  const tenants = ["Jane Doe", "John Doe"];

  let content: React.ReactElement;

  if (online.loading) {
    content = (
      <Paragraph>
        We are currently checking your online status. Please wait...
      </Paragraph>
    );
  } else {
    content = (
      <PageAnnouncement title="Process submission pending">
        <Paragraph>
          {online.result
            ? "You are online."
            : "You are currently working offline."}
        </Paragraph>
        <Paragraph>
          The Tenancy and Household Check for the tenancy at {address}, occupied
          by {tenants.join(", ")} has been saved to your device ready to be sent
          to your manager for review.
        </Paragraph>
        <Paragraph>
          <strong>You need to be online on this device to continue.</strong>
        </Paragraph>
        <Paragraph>
          If you can&apos;t go online now, when you are next online on this
          device, please come back to this Tenancy and Household Check from your
          work tray and click on the &lsquo;Save and submit to manager&rsquo;
          button below that will become able to be clicked.
        </Paragraph>
        {!online.error && online.result && (
          <Paragraph>
            <strong>You are online</strong>, and can submit this Tenancy and
            Household Check to your manager now.
          </Paragraph>
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
