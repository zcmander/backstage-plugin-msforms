import { MissingAnnotationEmptyState, useEntity } from "@backstage/plugin-catalog-react";
import { MSFORMS_PREFIX, READ_MORE_URL } from "./common";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { getConfiguredUrl, getEmbeddedUrl } from "./util";

export const MSFormsEntityPage = ({
  name,
  formsUrl,
}: {
  name: string;
  formsUrl?: string;
}) => {
  const entity = useEntity().entity;

  const configApi = useApi(configApiRef);
  const configured = getConfiguredUrl(entity, configApi);

  const annotationKey = `${MSFORMS_PREFIX}/${name}`;

  const annotation = (entity.metadata.annotations || {})[annotationKey];
  if (!annotation && !formsUrl && !configured) {
    return (
      <MissingAnnotationEmptyState
        annotation={annotationKey}
        readMoreUrl={READ_MORE_URL}
      />
    );
  }

  const embeddedUrl = getEmbeddedUrl(annotation ?? formsUrl ?? configured);

  return (
    <iframe
      title="Embedded form"
      width="100%"
      height="100%"
      src={embeddedUrl}
      style={{
        border: "none",
        maxWidth: "100%",
        maxHeight: "100vh",
        margin: 0,
      }}
      allowFullScreen
    />
  );
};
