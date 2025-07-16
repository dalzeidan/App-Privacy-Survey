import React from "react";
import "./AppPreview.css";

export default function AppPreview({ app }) {
  const { icon, title, subTitle, publisher,price, images, appDescription,category } = app;

  const parsedAppDescription = appDescription.split('\n').map((line,index) => {if (line.trim()) return (
    <p key={"desc-"+index+line}>{line.trim()}</p>
  )});

  return (
    <div className="app-preview-display">
      <div className="app-header flex-row">
        <img className="app-icon" src={icon} />
        <div className="app-header-content">
          <h3>{title}</h3>
          <div>{subTitle}</div>
          <div>{publisher}</div>
          {/* <div>ratings</div> */}
          <div>{price}</div>
        </div>
      </div>

      <div className="screenshots">
        <h2>iPhone Screenshots</h2>
        <div className="app-screenshots">
          {images && images.map((image, index) => {
            return <img key={index} src={image} className="app-screenshot"/>
          })}
        </div>
      </div>

      <div className="app-description">
        {parsedAppDescription}
      </div>

      {/* <div className="app-privacy">
        <h3>App Privacy</h3>
        <div>The developer, Apple, indicated that the app’s privacy practices may include handling of data as described below. For more information, see the developer’s privacy policy.</div>

        <div className="data-use-card">
          <h4>Data Linked to You</h4>
          <p>The following data may be collected and linked to your identity:</p>
          <div>DATA TYPES</div>
        </div>

      </div> */}

      {/* <div className="information">
        <h3>Information</h3>

        <div>
          Category<br/>
          {category}
        </div>
      </div> */}
    </div>
  );
}
