import { ConfigApi } from "@backstage/core-plugin-api";
import { Entity, getCompoundEntityRef } from "@backstage/catalog-model";

const ALLOWED_HOSTS = ["forms.office.com", "1drv.ms"];

export const getConfiguredUrl = (entity: Entity, configApi?: ConfigApi) => {
  const configs = configApi?.getOptionalConfigArray("msforms.entityMapping");
  const compoundEntityRef = getCompoundEntityRef(entity);
  const config = configs?.find((c) => {
    const kind = c.getString("kind");
    if (compoundEntityRef.kind.toLocaleLowerCase("en-US") !== kind) {
      return false;
    }
    const namespace = c.getOptionalString("namespace");
    if (namespace && namespace !== compoundEntityRef.namespace) {
      return false;
    }

    const name = c.getString("name");
    return name === compoundEntityRef.name.toLocaleLowerCase("en-US");
  });
  return config?.getString("url");
};

export const getEmbeddedUrl = (url: string) => {
  const newUrl = new URL(url);
    if (!ALLOWED_HOSTS.includes(newUrl.host)) {
    throw new Error(`Invalid URL, must match one of: ${ALLOWED_HOSTS.join(", ")}`);
  }
  if (newUrl.host !== "1drv.ms") {
    newUrl.searchParams.append("embed", "true");
  }
  return newUrl.toString();
}