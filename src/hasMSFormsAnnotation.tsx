import { Entity } from "@backstage/catalog-model";
import { MSFORMS_PREFIX } from "./common";

export const hasMSFormsAnnotation = (name: string) => (entity: Entity) => {
  for (const annotationKey in entity.metadata?.annotations || []) {
    if (annotationKey.startsWith(`${MSFORMS_PREFIX}/`)) {
      const annotationName = annotationKey.split("/")[1];

      if (annotationName === name) {
        return true;
      }
    }
  }

  return false;
};
