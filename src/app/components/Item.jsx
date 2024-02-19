import { CloseCircleOutlined } from "@ant-design/icons/lib/icons";

import "../styles/Item.css";

function Item({ itemKey, itemName, itemCategory, itemVariant, deleteItem, itemDescription, itemAmount }) {
  return (
    <li className="to-do-item" key={itemKey}>
      <div>
        <h3>{itemName}</h3>
        <p>{itemCategory}</p>
        <p>{itemVariant}</p>
        <p>{itemDescription}</p>
        <p>{itemAmount}</p>
      </div>
      <CloseCircleOutlined onClick={deleteItem} className="delete-button" />
    </li>
  );
}

export default Item;
