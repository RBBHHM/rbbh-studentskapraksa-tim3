import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/**
 * Select — Radix-backed dropdown. Composed from trigger/content/item
 * primitives; there are no styling variants beyond what className overrides.
 */
const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="at">
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="at">Austria</SelectItem>
        <SelectItem value="cz">Czech Republic</SelectItem>
        <SelectItem value="hu">Hungary</SelectItem>
        <SelectItem value="ro">Romania</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="at">
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="at">Austria</SelectItem>
      </SelectContent>
    </Select>
  ),
};
