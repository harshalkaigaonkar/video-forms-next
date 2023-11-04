import { createContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CloudinaryVideo } from "@cloudinary/url-gen";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, setPublicId }) {
  const [loaded, setLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.style.pointerEvents = "auto";
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          ...uwConfig,
          styles: {
            frame: {
              position: "absolute",
              zIndex: 1000,
            },
          },
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setVideoUrl(result.info.url);
            setPublicId(result.info.url);
          }
        }
      );

      document.getElementById("upload_widget").addEventListener(
        "click",
        function () {
          myWidget.open();
          document.body.style.pointerEvents = "auto";
        },
        true
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      {!!videoUrl && <video controls className="my-4" src={videoUrl}></video>}
      <Button id="upload_widget" onClick={initializeCloudinaryWidget}>
        Upload
      </Button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
