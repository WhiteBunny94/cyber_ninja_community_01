import React from "react";
import { useParams } from "react-router-dom";
import { useFetchResourcesQuery } from "../store";

const ReadResource = () => {
  const { resourceId } = useParams();
  const { data: resources } = useFetchResourcesQuery();

  // Find the selected resource by ID
  const resource = resources?.find((r) => String(r.id) === String(resourceId));

  if (!resources) return <p>Loading resources...</p>;
  if (!resource) return <p>❌ Resource not found.</p>;

  return (
    <div className="read-container">
      <header>
        <h1>{resource.title}</h1>
      </header>

      <nav>
        <a href="/">Home</a>
        <a href="/resources">Back to Resources</a>
      </nav>

      <div>
        <iframe
          src={resource.fileUrl}
          title={resource.title}
          width="100%"
          height="1000px"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </div>
  );
};

export default ReadResource;
