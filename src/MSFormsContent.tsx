import { catalogApiRef, MissingAnnotationEmptyState } from "@backstage/plugin-catalog-react";
import { MSFORMS_PREFIX, READ_MORE_URL } from "./common";
import { configApiRef, useApi } from "@backstage/core-plugin-api";
import { getConfiguredUrl, getEmbeddedUrl } from "./util";
import { useAsync } from "react-use";
import { Entity } from "@backstage/catalog-model";
import { AsyncState } from "react-use/lib/useAsyncFn";
import { ErrorDisplay, Progress } from "@backstage/frontend-plugin-api";

export const MSFormsContent = ({
  name,
  formsUrl,
  entityRef
}: {
  name: string;
  formsUrl?: string;
  entityRef?: string;
}): JSX.Element => {
    const catalog = useApi(catalogApiRef);

  const configApi = useApi(configApiRef);

  const entity: AsyncState<Entity|null> = useAsync(async () => {
    return entityRef ? catalog.getEntityByRef(entityRef) : null;
    }, [catalog, entityRef]);

  if (entity.loading) {
    return <Progress />;
  }

  if (entity.error) {
    return (<ErrorDisplay error={entity.error} resetError={() => {
      window.location.reload();
    }} />);
  }

  if (!entity.value) {
    return <div>Entity not found</div>;
  }


  const configured = getConfiguredUrl(entity.value, configApi);


  const annotationKey = `${MSFORMS_PREFIX}/${name}`;

  const annotation = (entity.value.metadata.annotations || {})[annotationKey];
  if (!annotation && !formsUrl && !configured) {
    return (
      <MissingAnnotationEmptyState
        annotation={annotationKey}
        readMoreUrl={READ_MORE_URL}
      />
    );
  }

  const url = getEmbeddedUrl(annotation ?? formsUrl ?? configured);

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
