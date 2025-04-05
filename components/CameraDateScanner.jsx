// src/App.js

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

function App() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");
  const [result, setResult] = useState("📸 Scan to extract date");

  const capture = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImageSrc(screenshot);
    setResult("⏳ Scanning...");

    Tesseract.recognize(screenshot, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      const match = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g);
      if (match && match.length > 0) {
        setResult(`✅ Date Found: ${match[0]}`);
        localStorage.setItem("capturedDate", match[0]);
      } else {
        setResult("❌ No date found!");
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📷 Date Scanner (Live)</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="rounded-md shadow-md w-80 mb-4"
      />

      <button
        onClick={capture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Capture & Scan
      </button>

      {imageSrc && (
        <img src={imageSrc} alt="Captured" className="mt-4 rounded w-64" />
      )}

      <p className="mt-4">{result}</p>
    </div>
  );
}

export default App;


