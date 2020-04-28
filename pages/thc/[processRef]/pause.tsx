import {
  Button,
  ErrorMessage,
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
import urlsForRouter from "../../../helpers/urlsForRouter";
import useDataValue from "../../../helpers/useDataValue";
import useOnlineWithRetry from "../../../helpers/useOnlineWithRetry";
import MainLayout from "../../../layouts/MainLayout";
import PageSlugs, { urlObjectForSlug } from "../../../steps/PageSlugs";
import PageTitles from "../../../steps/PageTitles";
import Storage from "../../../storage/Storage";

const PausePage: NextPage = () => {
  const router = useRouter();
  const processRef = getProcessRef(router);
  const online = useOnlineWithRetry();
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState();

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
      <PageAnnouncement title="Process pause pending">
        {residentData.loading ? (
          "Loading..."
        ) : (
          <>
            <Paragraph>
              {online.result
                ? "You are online."
                : "You are currently working offline."}
            </Paragraph>
            <Paragraph>
              The Tenancy and Household Check for the tenancy at {address},
              occupied by {tenants}, has been saved to your device but still
              needs to be saved to your work tray so you can resume it later.
            </Paragraph>
            <Paragraph>
              <strong>You need to be online on this device to continue.</strong>
            </Paragraph>
            <Paragraph>
              If you can&apos;t go online now, when you are next online{" "}
              <strong>on this device</strong>, please come back to this Tenancy
              and Household Check from your work tray and click on the
              &lsquo;Save and continue later&rsquo; button below that will
              become able to be clicked.
            </Paragraph>
            {!online.error && online.result && (
              <Paragraph>
                <strong>You are online</strong>, and can save this Tenancy and
                Household Check to your work tray now.
              </Paragraph>
            )}
          </>
        )}
      </PageAnnouncement>
    );
  }

  const { href, as } = urlsForRouter(
    router,
    urlObjectForSlug(router, PageSlugs.Paused)
  );

  const disabled =
    online.loading ||
    Boolean(online.error) ||
    !online.result ||
    saving ||
    !href.pathname ||
    !as.pathname;

  return (
    <MainLayout title={PageTitles.Pause}>
      {online.error && (
        <ErrorMessage>
          Something went wrong while checking your online status. Please reload
          the page and try again. If the problem persists, please try reopening
          this process from your worktray.
        </ErrorMessage>
      )}

      {saveError && (
        <ErrorMessage>
          Something went wrong. Please try going back and pausing this process
          again.
        </ErrorMessage>
      )}

      {content}

      {saving && (
        <ProgressBar
          progress={progress}
          incompleteLabel={saveError ? "Error" : "Saving..."}
          completeLabel={saveError ? "Error" : "Saved"}
        />
      )}

      {!saving && (
        <>
          <Button
            disabled={disabled}
            preventDoubleClick
            onClick={async (): Promise<void> => {
              if (!href.pathname || !as.pathname) {
                return;
              }

              try {
                setSaving(true);

                await persistProcessData(router, setProgress);
                await router.push(href, as);
              } catch (err) {
                console.error(err);
                setSaveError(err);
              }
            }}
            data-testid="submit"
          >
            {disabled
              ? "Waiting for connectivity..."
              : "Save and continue later"}
          </Button>
          <Button
            className="lbh-button--secondary govuk-button--secondary"
            onClick={(): void => {
              router.back();
            }}
          >
            Cancel and continue now
          </Button>
        </>
      )}

      <style jsx>{`
        :global(button:not(:last-child)) {
          margin-right: 1em;
        }
      `}</style>
    </MainLayout>
  );
};

export default PausePage;
