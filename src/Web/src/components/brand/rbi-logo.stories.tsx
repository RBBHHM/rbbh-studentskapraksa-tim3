import type { Meta, StoryObj } from "@storybook/react-vite";

import { RbiLogo } from "./rbi-logo";

/**
 * The official RBI "Make it happen" lock-up. Never recolour a variant with
 * CSS filters — pick the approved variant that matches the surface instead.
 */
const meta = {
  title: "Brand/RbiLogo",
  component: RbiLogo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "colour",
        "colourInverse",
        "mono",
        "monoInverse",
        "yellowInverse",
        "bankMono",
        "bankYellowInverse",
        "bankMark",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    decorative: { control: "boolean" },
  },
  args: {
    variant: "colour",
    size: "md",
  },
} satisfies Meta<typeof RbiLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inverse: Story = {
  args: { variant: "colourInverse" },
  parameters: { backgrounds: { value: "inverse" } },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {(
        ["colour", "mono", "yellowInverse", "bankMono", "bankYellowInverse", "bankMark"] as const
      ).map((variant) => (
        <div
          key={variant}
          className="flex flex-col items-start gap-2 rounded-sm border border-border-subtle p-4"
        >
          <RbiLogo variant={variant} />
          <span className="text-xs text-text-tertiary">{variant}</span>
        </div>
      ))}
    </div>
  ),
};
