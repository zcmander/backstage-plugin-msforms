import { render } from '@testing-library/react';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { MSFormContent } from './MSFormsContent';
import React from 'react';
import { Entity } from '@backstage/catalog-model';

const ENTITY: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'example-website',
  },
  spec: {
    type: 'website',
    lifecycle: 'experimental',
    owner: 'guests',
    system: 'examples',
    providesApis: ['example-grpc-api'],
  },
};

describe('MSFormsContent', () => {
  it('should render', () => {
    const { container } = render(
      <EntityProvider
        entity={{
          ...ENTITY,
          metadata: {
            ...ENTITY.metadata,
            annotations: {
              'forms.office.com/feedback': 'https://example.org',
            },
          },
        }}
      >
        <MSFormContent name={'feedback'} />
      </EntityProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render missing annotation', () => {
    const { container } = render(
      <EntityProvider entity={ENTITY}>
        <MSFormContent name={'feedback'} />
      </EntityProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
