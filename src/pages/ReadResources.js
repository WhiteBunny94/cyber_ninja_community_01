import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchResourcesQuery } from "../store";

const ReadResource = () => {
  const { resourceId } = useParams();
  const { data: resources } = useFetchResourcesQuery();

  // Find the selected resource by ID
  const resource = resources?.find((r) => String(r.id) === String(resourceId));

  useEffect(() => {
    // Helpful debug info when resource viewer doesn't render
    console.debug("ReadResource: resourceId=", resourceId);
    console.debug("ReadResource: resource=", resource);
  }, [resourceId, resource]);

  if (!resources) return <p>Loading resources...</p>;
  if (!resource) return <p>❌ Resource not found.</p>;

  return (
    <div className="read-container">
      <header>
        <h1>{resource.title}</h1>
      </header>

      <nav>
        <a href="#/">Home</a>
        <a href="#/resources">Back to Resources</a>
      </nav>

      <div>
        {resource.fileUrl ? (
          <iframe
            src={resource.fileUrl}
            title={resource.title}
            width="100%"
            height="1000px"
            style={{ border: "none" }}
          ></iframe>
        ) : (
          <div>
            <p style={{ color: "#b00" }}>No file URL available for this resource.</p>
            {/* Fallback: provide direct link to open in a new tab */}
            {resource.fileUrl ? (
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">Open resource in new tab</a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadResource;
