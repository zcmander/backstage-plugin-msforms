import { MissingAnnotationEmptyState, useEntity } from "@backstage/plugin-catalog-react";
import { MSFORMS_PREFIX, READ_MORE_URL } from "./common";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { getConfiguredUrl } from "./util";

export const MSFormContent = ({
  name,
  formsUrl,
}: {
  name: string;
  formsUrl?: string;
}) => {
  const { entity } = useEntity();

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

  const url = new URL(annotation ?? formsUrl ?? configured);
  if (url.host !== "forms.office.com") {
    throw new Error("Invalid URL, must match forms.office.com");
  }
  url.searchParams.append("embed", "true");

  return (
    <iframe
      title="Embedded form"
      width="100%"
      height="100%"
      src={url.toString()}
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
