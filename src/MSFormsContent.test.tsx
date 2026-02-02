import { EntityProvider } from "@backstage/plugin-catalog-react";
import { MSFormContent } from "./MSFormsContent";
import { Entity } from "@backstage/catalog-model";
import { configApiRef, errorApiRef } from "@backstage/core-plugin-api";
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from "@backstage/test-utils";
import { translationApiRef } from "@backstage/frontend-plugin-api";

const ENTITY: Entity = {
  apiVersion: "backstage.io/v1alpha1",
  kind: "Component",
  metadata: {
    name: "example-website",
  },
  spec: {
    type: "website",
    lifecycle: "experimental",
    owner: "guests",
    system: "examples",
    providesApis: ["example-grpc-api"],
  },
};

const configApi = mockApis.config.mock();
const translationApi = mockApis.translation.mock({
  getTranslation: () =>
    ({
      ready: true,
      t: () => "error",
    }) as any,
});

describe("MSFormsContent", () => {
  it("should render", async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[configApiRef, configApi]]}>
        <EntityProvider
          entity={{
            ...ENTITY,
            metadata: {
              ...ENTITY.metadata,
              annotations: {
                "forms.office.com/feedback": "https://forms.office.com/apua",
              },
            },
          }}
        >
          <MSFormContent name="feedback" />
        </EntityProvider>
      </TestApiProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  // TODO: Skipped due to translationApi mock being not working
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("should render missing annotation", async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApi],
          [errorApiRef, { post: jest.fn() }],
          [translationApiRef, translationApi],
        ]}
      >
        <EntityProvider entity={ENTITY}>
          <MSFormContent name="feedback" />
        </EntityProvider>
        ,
      </TestApiProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
