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
  const [data, setData] = useState([]);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);

  /* Effects */

  useEffect(() => {
    async function getList() {
      let { data: realtime, error } = await supabase.from("realtime").select("*");

      setData(realtime);
    }
    getList();
  }, []);

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
      setData((old) => old.concat(payload.new));
    } else if (payload.eventType === "DELETE") {
      //payload.old.id
      setData((old) => old.filter((item) => item.id != payload.old.id));
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
      data: {
        itemName,
        description,
        amount,
      },
    });

    setItemName("");
    setDescription("");
    setAmount("");
    setShowForm((prevShowForm) => !prevShowForm);
  }

  return (
    <>
      {showForm && (
        <form className="to-do-form" onSubmit={submitItem}>
          <div>
            <div>
              <label htmlFor="itemName">Item Name</label>
              <input type="text" name="itemName" value={itemName} required onChange={(e) => setItemName(e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button type="submit">Add</button>
        </form>
      )}

      <section className="to-do-list">
        <div className="to-do-heading">
          <h2>To-Do</h2>
        </div>
        <ul className="to-do-items">
          {data.map((item) => {
            return <Item itemName={item.data.itemName} description={item.data.description} amount={item.data.amount} key={item.data.id} deleteItem={() => deleteItem(item.id)} id={item.id}></Item>;
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
