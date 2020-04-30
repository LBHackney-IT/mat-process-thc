import { Link, List, Tag } from "lbh-frontend-react/components";
import querystring from "querystring";
import React from "react";

export enum TaskListStatus {
  Unavailable = "unavailable",
  NotStarted = "Not started",
  Started = "Started",
  Completed = "Completed",
}

/**
 * An item in {@link TaskList}.
 */
export interface TaskListItem {
  /**
   * The name of the task.
   */
  name: string;

  url: { pathname: string; query?: { [s: string]: string } };

  /**
   * The status to display against the task.
   */
  status: TaskListStatus | undefined;

  /**
   * @ignore
   */
  "data-testid"?: string;
}

export interface Props {
  items: TaskListItem[];
}

export const TaskList: React.FunctionComponent<Props> = (props) => {
  const { items } = props;

  return (
    <>
      <List
        className="task-list"
        items={items.map(({ name, url, status, "data-testid": testId }) => {
          const href = url.pathname
            ? url.query && Object.keys(url.query).length > 0
              ? `${url.pathname}?${querystring.stringify(url.query)}`
              : url.pathname
            : "";

          return (
            <>
              <span>{name}</span>
              {status && status !== TaskListStatus.Unavailable && (
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

        :global(.task-list li span),
        :global(.task-list li a) {
          margin: 0;
        }
      `}</style>
    </>
  );
};

TaskList.displayName = "TaskList";
