import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

/**
 * Primary action control. `primary` is reserved for the single most important
 * action per view; `secondary` is the workhorse outline button; `corporate`
 * is reserved for corporate/ESG contexts. See the component source for the
 * full brand rationale.
 */
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "corporate", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon", "icon-sm"],
    },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Continue",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Corporate: Story = { args: { variant: "corporate", children: "View ESG report" } };

export const Loading: Story = { args: { loading: true, children: "Saving" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(
        ["primary", "secondary", "tertiary", "corporate", "ghost", "destructive", "link"] as const
      ).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
