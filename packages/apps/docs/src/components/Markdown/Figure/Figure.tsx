import { Text } from '@kadena/react-ui';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useState } from 'react';
import { figCaption, figure, figureImg } from './styles.css';

interface IProps {
  alt: string;
  src: string;
}

export const Figure: FC<IProps> = ({ alt, src }) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setDimension({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };
  return (
    <figure className={figure}>
      <Image
        className={figureImg}
        src={src}
        alt={alt}
        width={dimension.width}
        height={dimension.height}
        sizes="100vw"
        placeholder="blur"
        blurDataURL="/assets/blur.jpg"
        onLoad={handleLoad}
      />
      {alt ? (
        <figcaption className={figCaption}>
          <Text size="sm" as="span">
            {alt}
          </Text>
        </figcaption>
      ) : (
        <></>
      )}
    </figure>
  );
};
