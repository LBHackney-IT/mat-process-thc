import { Link, List, Tag } from "lbh-frontend-react/components";
import querystring from "querystring";
import PropTypes from "prop-types";
import React from "react";

export enum TaskListStatus {
  Unavailable = "unavailable",
  NotStarted = "Not started",
  Started = "Started",
  Completed = "Completed"
}

/**
 * An item in {@link TaskList}.
 */
export interface TaskListItem {
  /**
   * The name of the task.
   */
  name: string;

  url: { pathname: string; query?: { [s: string]: string } | null };

  /**
   * The status to display against the task.
   */
  status: TaskListStatus;

  /**
   * @ignore
   */
  "data-testid"?: string | null;
}

export interface TaskListprops {
  items: TaskListItem[];
}

export const TaskList = (props: TaskListprops): JSX.Element => {
  const { items } = props;

  return (
    <>
      <List
        className="task-list"
        items={items.map(({ name, url, status, "data-testid": testId }) => {
          const href =
            url.query && Object.keys(url.query).length > 0
              ? `${url.pathname}?${querystring.stringify(url.query)}`
              : url.pathname;

          return (
            <>
              <span>{name}</span>
              {status !== TaskListStatus.Unavailable && (
                <span>
                  {status !== TaskListStatus.NotStarted && <Tag>{status}</Tag>}
                  <Link href={href} data-testid={testId}>
                    {status === TaskListStatus.NotStarted
                      ? "Start"
                      : status === TaskListStatus.Completed
                      ? "Edit"
                      : "Continue"}
                  </Link>
                </span>
              )}
            </>
          );
        })}
      />

      <style jsx>{`
        :global(.task-list li) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1em;
        }

        :global(.task-list li .lbh-tag) {
          margin-right: 2em;
        }
      `}</style>
    </>
  );
};

TaskList.displayName = "TaskList";

TaskList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      url: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        query: PropTypes.object
      }).isRequired,
      status: PropTypes.string.isRequired,
      "data-testid": PropTypes.string
    }).isRequired
  ).isRequired
};
