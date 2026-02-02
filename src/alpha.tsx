import { createFrontendPlugin } from "@backstage/frontend-plugin-api";
import { compatWrapper } from "@backstage/core-compat-api";
import { EntityContentBlueprint } from "@backstage/plugin-catalog-react/alpha";
import { Entity } from "@backstage/catalog-model";
import { hasMSFormsAnnotation } from "./hasMSFormsAnnotation";
import { configApiRef } from "@backstage/core-plugin-api";
import { getConfiguredUrl } from "./util";

const EntityMsForms = EntityContentBlueprint.makeWithOverrides({
  name: "entity-ms-forms",
  config: {
    schema: {
      name: (z) => z.string().optional(),
    },
  },
  inputs: {},
  factory: (originalFactory, { config, apis }) => {
    return originalFactory({
      path: config.path ?? "/survey",
      title: config.title ?? "Survey",
      filter: (entity: Entity) => {
        if (hasMSFormsAnnotation(config.name ?? "survey")(entity)) {
          return true;
        }
        const configApi = apis.get(configApiRef);
        const configured = getConfiguredUrl(entity, configApi);
        return configured !== undefined;
      },
      loader: async () => {
        return import("./MSFormsContent.tsx").then((m) =>
          compatWrapper(<m.MSFormContent name={config.name ?? "survey"} />),
        );
      },
    });
  },
});
/**
 * Backstage frontend plugin.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: "msforms",
  info: { packageJson: () => import("../package.json") },
  routes: {},
  extensions: [EntityMsForms],
});
