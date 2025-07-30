import { useContext, useState } from "react";
import "./App.css";
import InputRow from "./InputRow";
import { SurveyContext } from "./SurveyContext";
import exampleApp from "./assets/1exampleAppStore.jpeg";
import questionMark from "./assets/question-mark-outline.svg";
import ComparisonScreen from "./ComparisonScreen";
import AppPreview from "./AppPreview";
import { MultiControl } from "./SelectContext";

function App() {
  const { types, uses, getSurveyData, validateSurvey, exportData } =
    useContext(SurveyContext);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyResults, setSurveyResults] = useState(null);
  const [popupText, setPopupText] = useState("");

  const handleSubmit = () => {
    if (validateSurvey()) {
      const results = exportData();
      setSurveyResults(results);
      setSurveyCompleted(true);
      console.log("Survey submitted:", results);

      // Send results directly to backend
      fetch('api/data', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results), // This will now be an object, not an array
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to submit survey");
          return res.json();
        })
        .then((data) => {
          console.log("Successfully saved survey:", data);
        })
        .catch((err) => {
          console.error("Error submitting survey:", err);
        });
    } else {
      console.log("Survey validation failed");
    }
  };

  const handleLogData = () => {
    console.log("Current data:", getSurveyData());
  };

  // Show results if survey is completed
  if (surveyCompleted && surveyResults) {
    return (
      <ComparisonScreen results={surveyResults}/>
    );
  }

  const showHelp = (description) => {
    setPopupText(description);
  };

  const hideHelp = () => {
    setPopupText("");
  };

  const exampleApp = {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/82/6e/20/826e20c6-e1f9-0966-f035-10727f5bf61d/AppIcon-0-0-1x_U007epad-0-1-85-220.png/434x0w.webp",
    title: "Image Playground",
    subTitle: "Create Fun Images Easily", 
    publisher: "Apple",
    price: "Free",
    images: ["https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/ad/8b/bb/ad8bbb87-d8dc-bc5e-d2d0-64ddde4c06b7/Image_1.jpeg/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/69/0c/cd/690ccdf2-c554-1288-cee2-68cdf845abfb/Image_2.jpeg/460x0w.webp",
      "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/a7/1f/89/a71f8991-72c1-4695-1fb0-fc84b3a3b671/IMG_0068.jpeg/460x0w.webp"
    ],
    category: "Graphics & Design",
    appDescription: `Image Playground, powered by Apple Intelligence, lets you turn descriptions, concepts or people from your photo library into original, fun images in unique styles.

    Create Delightful Images

    Use concepts, descriptions and your photo library to create unique images. Get started quickly by choosing from a range of fine-tuned concepts to add them to your playground. Pick from categories like themes, costumes, accessories and places.


    Easy to Use

    The Image Playground experience was built from the ground up to be easy to use. Focus on experimenting and making fun images intuitively with suggestions, quick previews and a history of your previews you can easily revert back to. No need to learn how to build the perfect text description or worry about losing something along the way.


    Created with Style

    Create images in a set of distinct styles designed by Apple, and refined through hand-curated artwork. Animation style offers a whimsical, cartoon look with expressive characters and cinematic scenes. Illustration style is defined by strong outlines, simple shapes, and bold colors, providing uplifting and playful compositions. The highly detailed and academic Sketch style produces gorgeous drawings on stark backgrounds.


    Available Where You Need It

    Image Playground is integrated across apps. Use it in places like Messages when you’re messaging with friends and family and want to express yourself with a fun and delightful image. And if you use Image Playground, you’ll see suggested concepts based on the context of your messages thread.


    Image Playground is available in the following languages:

    English

    French

    German

    Italian

    Japanese

    Portuguese (Brazil)

    Spanish`
  }

  return (
    <div className="page survey-page">
      <MultiControl />
      <div className="survey">
        <div className="purpose-headers">
          <div className="header-labels type-header">
            {popupText == "" ? (
              <>
                <div>Data Access</div>
                <div className="answer-legend">
                  <div className="answer-item">
                    <div className="color-box color-green"></div>
                    <span>Not collected</span>
                  </div>
                  <div className="answer-item">
                    <div className="color-box color-orange"></div>
                    <span>Used internally</span>
                  </div>
                  <div className="answer-item">
                    <div className="color-box color-red"></div>
                    <span>Shared to 3rd party</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="popup">{popupText}</div>
            )}
          </div>

          {uses.map((purpose) => (
            <div
              key={purpose.category + "header"}
              className="purpose-header"
              onMouseEnter={() => showHelp(purpose.description)}
              onMouseLeave={() => hideHelp()}
            >
              <div className="purpose-header-text-tilt">{purpose.category}</div>
              {/* <img src={questionMark} width={"20px"} height={"20px"} /> */}
            </div>
          ))}
        </div>
        {types.map((section) => {
          return (
            <div key={section.category} className="data-type-section">
              <h2>{section.category}</h2>
              {section.items.map((type) => (
                <div
                  key={type.name}
                  className="full-row row"
                >
                  <div
                    className="type-header"
                    onMouseEnter={() => showHelp(type.description)}
                    onMouseLeave={() => hideHelp()}
                  >
                    {type.name}
                  </div>
                  <InputRow typeName={type.name} />
                </div>
              ))}
            </div>
          );
        })}

        <div
          className="survey-controls"
          style={{ margin: "20px 0", textAlign: "center" }}
        >
          <button onClick={handleSubmit}>Submit Survey</button>
        </div>
      </div>
      <div className="app-preview">
        <div className="app-preview-header">App Store Preview</div>
        <AppPreview app={exampleApp}/>
        {/* <img src={exampleApp} width={"100%"} /> */}
      </div>
    </div>
  );
}

export default App;
