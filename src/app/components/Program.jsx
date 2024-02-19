"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";

import Item from "./Item";
import "../styles/Program.css";

// Create a single supabase client for interacting with your database
const supabase = createClient("https://cxcqsukrslfnrywvkkml.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y3FzdWtyc2xmbnJ5d3Zra21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5NDE1MzYsImV4cCI6MTk5NzUxNzUzNn0.q1lX-ubiMOiGU0SMT99lf7QauZ0wgy7dyaNSLxTobUg");

function Program() {
  /* States */
  const [listData, setListData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemVariant, setItemVariant] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [listOfItems, setListOfItems] = useState([]);

  /* Effects */

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    // Mapping through listData and extracting the value of "name" to save it as an array in listOfItems
    const names = listData.map((item) => item.name);
    setListOfItems(names);
  }, [listData]);

  useEffect(() => {
    // Listen to inserts
    supabase.channel("todos").on("postgres_changes", { event: "*", schema: "public", table: "realtime" }, handleInserts).subscribe();
  }, []);

  /* Functions */
  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const handleInserts = (payload) => {
    console.log("Change received!", payload);
    if (payload.eventType === "INSERT") {
      setListData((old) => old.concat(payload.new));
    } else if (payload.eventType === "DELETE") {
      //payload.old.id
      setListData((old) => old.filter((item) => item.id != payload.old.id));
    }
  };

  async function deleteItem(id) {
    console.log(`You deleted item ${id}`);
    const { error } = await supabase.from("realtime").delete().eq("id", id);
  }

  async function submitItem(e) {
    e.preventDefault();
    console.log(e);
    const { error } = await supabase.from("realtime").insert({
      name: itemName.toLowerCase(),
      category: itemCategory.toLowerCase(),
      variant: itemVariant.toLowerCase() || null,
      description: itemDescription.toLowerCase() || null,
      amount: itemAmount || null,
      active: true,
    });

    setItemName("");
    setItemCategory("");
    setItemVariant("");
    setItemDescription("");
    setItemAmount("");
    setShowForm((prevShowForm) => !prevShowForm);
  }

  async function getList() {
    let { data: realtime } = await supabase.from("realtime").select("*");
    setListData(realtime);
  }

  return (
    <>
      {showForm && (
        <form className="to-do-form" onSubmit={submitItem}>
          <div>
            <label htmlFor="itemName">Name</label>
            <input type="text" name="itemName" value={itemName} required onChange={(e) => setItemName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="itemCategory">Category</label>
            <input type="text" name="itemCategory" value={itemCategory} required onChange={(e) => setItemCategory(e.target.value)} />
          </div>
          <div>
            <label htmlFor="itemVariant">Variant</label>
            <input type="text" name="itemVariant" value={itemVariant} onChange={(e) => setItemVariant(e.target.value)} />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input type="text" name="description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" name="amount" value={itemAmount} onChange={(e) => setItemAmount(e.target.value)} />
          </div>
          <button type="submit">Add</button>
        </form>
      )}

      <section className="to-do-list">
        <div className="to-do-heading">
          <h2>To-Do</h2>
        </div>
        <ul className="to-do-items">
          {listData.map((item, index) => {
            return <Item itemName={item.name} itemCategory={item.category} itemVariant={item.variant} itemDescription={item.description} itemAmount={item.amount} itemKey={index} key={index} deleteItem={() => deleteItem(item.id)} id={item.id}></Item>;
          })}
        </ul>
        <button onClick={toggleForm} className="add-button">
          <PlusOutlined />
        </button>
      </section>
    </>
  );
}

export default Program;
