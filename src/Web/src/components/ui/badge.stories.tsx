import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";

/**
 * Status badge. Tone communicates state, but never through colour alone —
 * `withDot` adds a leading dot so the signal survives greyscale printing.
 */
const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "brand", "corporate"],
    },
    variant: {
      control: "select",
      options: ["subtle", "solid", "outline"],
    },
    withDot: { control: "boolean" },
  },
  args: {
    children: "Active",
    tone: "neutral",
    variant: "subtle",
    withDot: false,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = {};

export const Solid: Story = { args: { variant: "solid", tone: "success" } };

export const WithDot: Story = { args: { withDot: true, tone: "warning" } };
