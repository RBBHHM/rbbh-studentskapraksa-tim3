import type { Meta, StoryObj } from "@storybook/react-vite";

import { Callout } from "./callout";

/**
 * Inline message block. Each tone pairs a colour with a distinct icon so
 * meaning survives greyscale printing and colour-vision deficiency.
 */
const meta = {
  title: "Components/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger", "brand"],
    },
  },
  args: {
    tone: "info",
    title: "Heads up",
    children: "This is supplementary information relevant to the current task.",
  },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Danger: Story = {
  args: { tone: "danger", title: "Action required", children: "This change cannot be undone." },
};
