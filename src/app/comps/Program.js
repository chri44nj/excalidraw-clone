"use client";
import { useState } from "react";
import styles from "./Program.module.css";
function Program({ data }) {
  const [color, setColor] = useState("black");
  const [shape, setShape] = useState("circle");
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [radius, setRadius] = useState(50);
  const [mode, setMode] = useState("create");
  function submit(e) {
    e.preventDefault();
    setMode("insert");
  }
  function clicked(e) {
    if (mode === "insert") {
      console.log(e);
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
            <option value="cirlce">Circle</option>
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
      <svg
        onClick={clicked}
        className={styles.canvas}
        viewBox="0 0 1000 1000"
      ></svg>
    </>
  );
}

export default Program;
