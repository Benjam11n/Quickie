import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from './button';
import { DEFAULT_EMPTY, DEFAULT_ERROR } from '@/constants/states';
import { Card } from './card';

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="flex flex-col items-center justify-center w-full my-16 sm:mt-36">
    <div className="relative w-80 h-64">
      <Image
        src={image.dark}
        alt={image.alt}
        layout="fill"
        objectFit="contain"
        className="hidden dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        layout="fill"
        objectFit="contain"
        className="block dark:hidden"
      />
    </div>
    <h2 className="mt-8 text-4xl holographic-text font-bold text-dark200 dark:text-light900">
      {title}
    </h2>
    <p className="mt-8 my-3.5 max-w-md text-center text-foreground">
      {message}
    </p>
    {button && (
      <Link href={button.href}>
        <Button size="lg" className="mt-8">
          {button.text}
        </Button>
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: '/images/light-error.png',
          dark: '/images/dark-error.png',
          alt: 'Error state illustration',
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          light: '/images/light-illustration.png',
          dark: '/images/dark-illustration.png',
          alt: 'Empty state illustration',
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );

  return <div>{render(data)}</div>;
};

export default DataRenderer;
