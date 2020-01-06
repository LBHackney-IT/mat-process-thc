import { Link, List, Tag } from "lbh-frontend-react/components";
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

  /**
   * A function to be passed to the button for the task list.
   */
  href: string;

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
        items={items.map(({ name, href, status, "data-testid": testId }) => (
          <>
            <span>{name}</span>
            {status !== "" && (
              <span>
                {nullAsUndefined(status) !== undefined && <Tag>{status}</Tag>}
                <Link href={href} data-testid={testId}>
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
      href: PropTypes.string.isRequired,
      status: PropTypes.string,
      "data-testid": PropTypes.string
    }).isRequired
  ).isRequired
};
