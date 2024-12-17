import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [dataImage, setDataImage] = useState({});
  const AZURE_API_KEY = "4FXH0CrAncmdho2gFz7JCSGSE0NeP0doICrJknFka37MDKM6rKmKJQQJ99ALACYeBjFXJ3w3AAAFACOGPXYx";
  const AZURE_ENDPOINT = "https://leiru-vision.cognitiveservices.azure.com/";

  useEffect(() => {
    if (analysisResult) {
      setDataImage(JSON.stringify(analysisResult, null, 2));
    }
  }, [analysisResult]);

  const handleAnalyzeImage = async () => {
    setError(null);
    setAnalysisResult(null);

    if (!imageUrl) {
      setError("Ingresa la URL de la imagen");
      return;
    }

    try {
      const response = await axios.post(
        `${AZURE_ENDPOINT}/vision/v3.2/analyze`,
        {
          url: imageUrl,
        },
        {
          headers: {
            "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
            "Content-Type": "application/json",
          },
          params: {
            visualFeatures: "Description,Tags", // Specify features to analyze
            language: "es",
          },
        }
      );

      setAnalysisResult(response.data);
    } catch (err) {
      setError("Error al analizar la imagen, intentalo nuevamente");
    }

    console.log(dataImage);
  };

  return (
    <div className="wrapper">
      <h1>Azure Computer Vision - UPIICSA</h1>
      <div className="url-container">
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={handleAnalyzeImage}>Analyze</button>
      </div>
      <h2>Resultado del Análisis</h2>
      <br></br>
      <br></br>
      {error && <p>{error}</p>}

      {analysisResult && (
        <div className="resultImage">
          <div className="descCont">
            <h3>Descripción:</h3>
            <p>
              {analysisResult.description?.captions[0]?.text ||
                "Sin descripción"}
            </p>
          </div>

          <div className="tagsCont" style={{ overflowY: "auto" }}>
            {" "}
            <h3>Etiquetas</h3>
            <ul style={{ maxHeight: "100px" }}>
              {analysisResult.tags?.map((tag, index) => (
                <li key={index}>
                  <strong>{tag.name}</strong> - Confianza:{" "}
                  {(tag.confidence * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>

          <div className="metCont">
            {" "}
            <h3>Metadatos:</h3>
            <p>
              <b>Altura:</b> {analysisResult.metadata.height}px
            </p>
            <p>
              <b>Anchura:</b> {analysisResult.metadata.width}px
            </p>
            <p>
              <b>Formato:</b> {analysisResult.metadata.format}
            </p>
          </div>

          <div className="imgCont">
            <h3>Imagen:</h3>
            <img src={imageUrl}></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
