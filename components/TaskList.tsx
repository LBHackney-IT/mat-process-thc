import { Link, List, Tag } from "lbh-frontend-react/components";
import querystring from "querystring";
import { nullAsUndefined } from "null-as-undefined";
import PropTypes from "prop-types";
import React from "react";

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
   *
   * If undefined, the status is replaced by a link to the task. To not show
   * anything, pass an empty string.
   */
  status?: string | null;

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
        items={items.map(({ name, url, status, "data-testid": testId }) => (
          <>
            <span>{name}</span>
            {status !== "" && (
              <span>
                {nullAsUndefined(status) !== undefined && <Tag>{status}</Tag>}
                <Link
                  href={`${url.pathname}?${querystring.stringify({
                    ...url.query,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    process_type: "thc"
                  })}`}
                  data-testid={testId}
                >
                  {nullAsUndefined(status) === undefined ? "Start" : "Edit"}
                </Link>
              </span>
            )}
          </>
        ))}
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
      status: PropTypes.string,
      "data-testid": PropTypes.string
    }).isRequired
  ).isRequired
};
