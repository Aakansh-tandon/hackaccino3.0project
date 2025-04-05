"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

function App() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState("");
  const [dateResult, setDateResult] = useState("📸 Scan to extract date");
  const [rawText, setRawText] = useState("");
  const [productName, setProductName] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [expiryOnly, setExpiryOnly] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("scannedItems")) || [];
    setSavedData(data);
  }, []);

  const processImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
          imgData.data[i] = avg;
          imgData.data[i + 1] = avg;
          imgData.data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const capture = async () => {
    if (!productName.trim()) return alert("Product name daal bhai!");

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return alert("Camera not ready!");

    const processedImage = await processImage(screenshot);
    setImageSrc(processedImage);
    setDateResult("⏳ Scanning...");
    setRawText("");

    Tesseract.recognize(processedImage, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      console.log("OCR Output: ", text);
      setRawText(text);

      const match = text.match(
        /\b((\d{1,2}[-\/.\s]?(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|SEPT|OCT|NOV|DEC)[-\/.\s]?\d{2,4})|(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4})|(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}))\b/gi
      );
      
      

      if (match && match.length > 0) {
        const cleanDate = expiryOnly
          ? match.find((m) => /exp|expiry|exp\.|use by/i.test(text.substring(text.indexOf(m) - 20, text.indexOf(m) + 20))) || match[0]
          : match[0];

        setDateResult(cleanDate);

        const updated = [...savedData, { name: productName, date: cleanDate }];
        setSavedData(updated);
        localStorage.setItem("scannedItems", JSON.stringify(updated));
        setProductName("");
      } else {
        setDateResult("❌ No date found");
      }
    });
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-4">📦 Product Date Scanner</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="rounded-md shadow-md w-80 mb-4"
      />

      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="📝 Enter product name"
        className="px-3 py-2 border rounded w-64 mb-2"
      />

      <div className="flex items-center justify-center gap-2 mb-4">
        <input
          type="checkbox"
          id="expiryOnly"
          checked={expiryOnly}
          onChange={(e) => setExpiryOnly(e.target.checked)}
        />
        <label htmlFor="expiryOnly" className="text-sm">
          Only save expiry date
        </label>
      </div>

      <button
        onClick={capture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Capture & Scan
      </button>

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Captured"
          className="mt-4 mx-auto rounded w-64"
        />
      )}

      <p className="mt-4 font-semibold">📅 {dateResult}</p>

      {rawText && (
        <div className="mt-2 p-2 bg-gray-100 text-left text-xs max-w-md mx-auto rounded shadow">
          <strong>🔍 OCR Raw Output:</strong>
          <pre>{rawText}</pre>
        </div>
      )}

      <div className="mt-6 text-left max-w-md mx-auto">
        <h2 className="font-semibold mb-2">📜 Scanned Items:</h2>
        <ul className="text-sm">
          {savedData.map((item, index) => (
            <li key={index} className="mb-1">
              <strong>{item.name}:</strong> {item.date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
