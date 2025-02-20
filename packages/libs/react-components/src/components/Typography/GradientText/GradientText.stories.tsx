import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GradientText } from '..';

const meta: Meta<typeof GradientText> = {
  title: 'Typography/GradientText',
  component: GradientText,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GradientText>;

export const Primary: Story = {
  name: 'GradientText',
  args: {
    children: 'web3',
  },
  render: ({ children }) => <GradientText>{children}</GradientText>,
};
