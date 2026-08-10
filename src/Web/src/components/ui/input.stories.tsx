import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Label } from "./label";

/**
 * Text input, always paired with a `Label`. Neither component exposes visual
 * variants — state (disabled, invalid) is expressed through native HTML
 * attributes.
 */
const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    type: "text",
    placeholder: "Jane Doe",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="story-email">Email</Label>
      <Input id="story-email" {...args} type="email" placeholder="jane@example.com" />
    </div>
  ),
};
