import { Tag } from "lbh-frontend-react/components/Tag";
import { Button } from "lbh-frontend-react/components/Button";
import Link from "next/link";
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
   * Whether the task is complete or not.
   */
  completed?: boolean | null;
  /**
   * A function to be passed to the button for the task list.
   */
  linkHref: string;
}

export interface TaskListprops {
  items: TaskListItem[];
}

export const TaskList = (props: TaskListprops): JSX.Element => {
  const { items } = props;
  return (
    <>
      <ul className="task-list">
        {items.map((item, index) => (
          <li key={index} className="task-list__item">
            <span className="task-list__task-name">{item.name}</span>
            <span className="task-list__status">
              {item.completed ? (
                <Tag>Completed</Tag>
              ) : (
                <Link href={item.linkHref}>
                  <Button className="task-list__button">Start</Button>
                </Link>
              )}
            </span>
          </li>
        ))}
      </ul>
      <style jsx>
        {`
          .task-list {
            list-style: none;
            padding: 0;
          }

          .task-list__item:first-child {
            border-top: 1px solid #b1b4b6;
          }
          .task-list__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #b1b4b6;
            margin-bottom: 0 !important;
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .task-list__button {
            margin-top: 0 !important;
          }
        `}
      </style>
    </>
  );
};

TaskList.PropTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      completed: PropTypes.bool,
      linkHref: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
};
