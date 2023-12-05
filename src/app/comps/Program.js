"use client";

import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://uwrwptibotlxlvcdeicv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cndwdGlib3RseGx2Y2RlaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ3OTI4MDYsImV4cCI6MTk4MDM2ODgwNn0.FuHj1T6qJO-wQ_aWaaXNFVfZPG45FsnE3RvHd3PGQmA"
);

import { useState, useEffect } from "react";
import styles from "./Program.module.css";
function Program() {
  const [color, setColor] = useState("black");
  const [shape, setShape] = useState("circle");
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [radius, setRadius] = useState(50);
  const [mode, setMode] = useState("create");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function get() {
      let { data: excalidraw, error } = await supabase
        .from("excalidraw")
        .select("*");

      setData(excalidraw);
    }
    get();
  }, []);

  useEffect(() => {
    // Listen to inserts
    supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "excalidraw" },
        handleInserts
      )
      .subscribe();
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
    const { error } = await supabase.from("excalidraw").delete().eq("id", id);
  }

  function submit(e) {
    e.preventDefault();

    setMode("insert");
  }
  async function clicked(e) {
    if (mode === "insert") {
      console.log(e);
      const { error } = await supabase.from("excalidraw").insert({
        data: {
          type: shape,
          x: e.pageX,
          y: e.pageY,
          radius,
          width,
          height,
          fill: color,
        },
      });
      setMode("create");
    }
  }
  return (
    <>
      <div
        className={styles.form}
        style={{ display: mode !== "create" ? "none" : "" }}
      >
        <form onSubmit={submit}>
          <label htmlFor="color">Color</label>
          <input
            type="color"
            name="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <label htmlFor="shape">Shape</label>
          <select
            name="shape"
            id="shape"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
          >
            <option value="circle">Circle</option>
            <option value="rect">Rect</option>
          </select>
          <div
            className="rectSettings"
            style={{ display: shape === "rect" ? "" : "none" }}
          >
            <label htmlFor="width">Width</label>
            <input
              type="number"
              id="width"
              name="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <label htmlFor="height">Height</label>
            <input
              type="number"
              id="height"
              name="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div
            className="circleSettings"
            style={{ display: shape === "circle" ? "" : "none" }}
          >
            <label htmlFor="radius">Radius</label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
          </div>
          <button>Save</button>
        </form>
      </div>
      <svg onClick={clicked} className={styles.canvas} viewBox="0 0 1000 1000">
        {data.map((item) => {
          if (item.data.type === "rect") {
            return (
              <rect
                onDoubleClick={() => deleteIt(item.id)}
                key={item.id}
                x={item.data.x}
                y={item.data.y}
                width={item.data.width}
                height={item.data.height}
                fill={item.data.fill}
              />
            );
          } else {
            return (
              <circle
                onDoubleClick={() => deleteIt(item.id)}
                key={item.id}
                cx={item.data.x}
                cy={item.data.y}
                r={item.data.radius}
                fill={item.data.fill}
              />
            );
          }
        })}
      </svg>
    </>
  );
}

export default Program;
