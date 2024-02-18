import { CloseCircleOutlined } from "@ant-design/icons/lib/icons";

import "../styles/Item.css";

function Item({ key, itemName, deleteItem, description, amount }) {
  return (
    <li className="to-do-item" key={key}>
      <div>
        <h3>{itemName}</h3>
        <p>{description}</p>
        <p>{amount}</p>
      </div>
      <CloseCircleOutlined onClick={deleteItem} className="delete-button" />
    </li>
  );
}

export default Item;
