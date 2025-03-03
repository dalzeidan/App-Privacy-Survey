import "./App.css";

function App() {
  return (
    <div className="page survey-page">
      <div className="survey">
        Survey page
        <div className="survey-group">
          <h2 className="group-label">Group Label</h2>
          <div className="properties">
            <div className="survey-headers table">
              <div className="survey-header">Type</div>
              <div className="survey-header">Extent of access</div>
              <div className="survey-header">Purpose</div>
            </div>
            <div className="item-container table">
              <div className="item">
                <div className="item-name">Name</div>
                <div className="item-desc">Description</div>
              </div>
              <div className="item-selections">
                <div className="item-select">
                  <div className="item-select-label">None</div>
                  <input type="checkbox"></input>
                </div>
                <div className="item-select">
                  <div className="item-select-label">Limited</div>
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
          </div>
        </div>
      </div>
      <div className="app-preview">App store preview</div>
    </div>
  );
}

export default App;
