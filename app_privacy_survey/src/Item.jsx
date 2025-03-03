import React, { useState } from "react";

export default function Item(props) {
  const {name, desc} = props;
  const [extentLevel, setExtentLevel] = useState(1); // default to collected locally
  const [purposes, setPurposes] = useState([]); // 

  return (
    <div className="item-container table">
      <div className="item">
        <div className="item-name">{name}</div>
        <div className="item-desc">{desc}</div>
      </div>
      <div className="item-selections">
        <div className="item-select">
          <div className="item-select-label">Not accessed</div>
          <input type="checkbox"></input>
        </div>
        <div className="item-select">
          <div className="item-select-label">1st party only</div>
          <input type="checkbox"></input>
        </div>
        <div className="item-select">
          <div className="item-select-label">3rd Party</div>
          <input type="checkbox"></input>
        </div>
      </div>
      <div className="item-selections">
        <div className="item-select">
          <div className="item-select-label">None</div>
          <input type="checkbox"></input>
        </div>
        <div className="item-select">
          <div className="item-select-label">Identification</div>
          <input type="checkbox"></input>
        </div>
        <div className="item-select">
          <div className="item-select-label">Tracking</div>
          <input type="checkbox"></input>
        </div>
      </div>
    </div>
  );
}
