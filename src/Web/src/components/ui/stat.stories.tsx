import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users } from "lucide-react";

import { Stat } from "./stat";

/**
 * Statistic (KPI) tile. `variant` covers the four approved treatments — a
 * yellow top rule (default), a bordered card, a filled panel and plain type.
 */
const meta = {
  title: "Components/Stat",
  component: Stat,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["rule", "card", "panel", "plain"],
    },
    align: {
      control: "select",
      options: ["start", "center"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    label: "Active customers",
    value: "48,203",
    variant: "rule",
    align: "start",
    size: "md",
    trend: { direction: "up", value: "+4.2%", caption: "vs. last quarter" },
    icon: Users,
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rule: Story = {};

export const Card: Story = { args: { variant: "card" } };

export const Panel: Story = { args: { variant: "panel" } };
