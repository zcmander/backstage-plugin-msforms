import { ConfigApi } from "@backstage/core-plugin-api";
import { Entity, getCompoundEntityRef } from "@backstage/catalog-model";

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
