import type { Meta, StoryObj } from "@storybook/react-vite";

import { Display, Eyebrow, Heading, Prose, Text } from "./typography";

/**
 * Typography primitives. `Heading`'s `level` (document outline) is kept
 * independent from its visual `size`, so the outline order is never broken
 * for the sake of appearance.
 */
const meta = {
  title: "Foundations/Typography",
  component: Display,
  tags: ["autodocs"],
} satisfies Meta<typeof Display>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisplaySizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Display size="xl">Make it happen</Display>
      <Display size="lg">Make it happen</Display>
      <Display size="md">Make it happen</Display>
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <Heading key={level} level={level as 1 | 2 | 3 | 4 | 5 | 6}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const TextTones: Story = {
  render: () => (
    <div className="space-y-2">
      <Text tone="primary">Primary text</Text>
      <Text tone="secondary">Secondary text</Text>
      <Text tone="tertiary">Tertiary text</Text>
      <Text tone="brand">Brand text</Text>
      <Text tone="corporate">Corporate text</Text>
      <Text tone="danger">Danger text</Text>
    </div>
  ),
};

export const EyebrowAndProse: Story = {
  render: () => (
    <div>
      <Eyebrow>Section label</Eyebrow>
      <Prose>
        <p>
          Prose wraps long-form documentation content with sensible link, list and code styling out
          of the box.
        </p>
      </Prose>
    </div>
  ),
};
