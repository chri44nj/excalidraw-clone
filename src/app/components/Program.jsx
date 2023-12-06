"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";

import Task from "./Task";
import "../styles/Program.css";

// Create a single supabase client for interacting with your database
const supabase = createClient("https://cxcqsukrslfnrywvkkml.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Y3FzdWtyc2xmbnJ5d3Zra21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE5NDE1MzYsImV4cCI6MTk5NzUxNzUzNn0.q1lX-ubiMOiGU0SMT99lf7QauZ0wgy7dyaNSLxTobUg");

function Program() {
  const [data, setData] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  useEffect(() => {
    async function get() {
      let { data: realtime, error } = await supabase.from("realtime").select("*");

      setData(realtime);
    }
    get();
  }, []);

  useEffect(() => {
    // Listen to inserts
    supabase.channel("todos").on("postgres_changes", { event: "*", schema: "public", table: "realtime" }, handleInserts).subscribe();
  }, []);

  const handleInserts = (payload) => {
    console.log("Change received!", payload);
    if (payload.eventType === "INSERT") {
      setData((old) => old.concat(payload.new));
    } else if (payload.eventType === "DELETE") {
      //payload.old.id
      setData((old) => old.filter((item) => item.id != payload.old.id));
    }
  };

  async function deleteIt(id) {
    console.log(`You deleted task ${id}`);
    const { error } = await supabase.from("realtime").delete().eq("id", id);
  }

  async function submitTask(e) {
    e.preventDefault();
    console.log(e);
    const { error } = await supabase.from("realtime").insert({
      data: {
        taskName,
        description,
        amount,
      },
    });
  }

  return (
    <>
      {showForm && (
        <form className="to-do-form" onSubmit={submitTask}>
          <div>
            <div>
              <label htmlFor="taskName">Task Name</label>
              <input type="text" name="taskName" value={taskName} required onChange={(e) => setTaskName(e.target.value)} />
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
          <input type="submit" value="Add" />
        </form>
      )}

      <section className="to-do-list">
        <div className="to-do-heading">
          <h2>To-Do</h2>
        </div>
        <ul className="to-do-tasks">
          {data.map((task) => {
            return <Task taskName={task.data.taskName} description={task.data.description} amount={task.data.amount} key={task.data.id} deleteIt={() => deleteIt(task.id)} id={task.id}></Task>;
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
