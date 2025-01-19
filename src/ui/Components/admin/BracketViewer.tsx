import React, { useEffect, useRef } from "react";
import "brackets-viewer/dist/brackets-viewer.css";

interface BracketViewerProps {
  data: any; // The bracket data to be visualized
}

const BracketViewer: React.FC<BracketViewerProps> = ({ data }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data) {
      import("brackets-viewer")
        .then((BracketsViewerModule) => {
          const BracketsViewer = BracketsViewerModule.default;
          new BracketsViewer({
            selector: viewerRef.current,
            data: data,
          });
        })
        .catch((error) => {
          console.error("Failed to load brackets-viewer:", error);
        });
    }
  }, [data]);

  return <div ref={viewerRef} style={{ minHeight: "500px", width: "100%" }} />;
};

export default BracketViewer;
