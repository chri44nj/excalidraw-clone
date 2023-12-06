import { CloseCircleOutlined } from "@ant-design/icons/lib/icons";

import "../styles/Task.css";

function Task({ key, taskName, deleteIt, description, amount }) {
  return (
    <li className="to-do-task" key={key}>
      <div>
        <h3>{taskName}</h3>
        <p>{description}</p>
        <p>{amount}</p>
      </div>
      <CloseCircleOutlined onClick={deleteIt} className="delete-button" />
    </li>
  );
}

export default Task;
