import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MSFORMS_PREFIX, READ_MORE_URL } from './common';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

export const MSFormContent = ({ name }: { name: string }) => {
  const { entity } = useEntity();

  const annotationKey = `${MSFORMS_PREFIX}/${name}`;

  const annotation = (entity.metadata.annotations || {})[annotationKey];
  if (!annotation) {
    return (
      <MissingAnnotationEmptyState
        annotation={annotationKey}
        readMoreUrl={READ_MORE_URL}
      />
    );
  }

  const url = new URL(annotation);
  url.searchParams.append('embed', 'true');

  return (
    <iframe
      title="Embedded form"
      width="100%"
      height="100%"
      src={url.toString()}
      frameBorder={0}
      marginWidth={0}
      marginHeight={0}
      style={{
        border: 'none',
        maxWidth: '100%',
        maxHeight: '100vh',
      }}
      allowFullScreen
    />
  );
};
