import type { Meta, StoryObj } from "@storybook/react-vite";

import { BentoCard, BentoCardBody, BentoGrid } from "./bento-grid";

/**
 * BentoGrid — a fixed 12-column desktop track that collapses to one column on
 * small screens. Tiles declare their own `span`/`rowSpan`/`tone`.
 */
const meta = {
  title: "Components/BentoGrid",
  component: BentoGrid,
  tags: ["autodocs"],
  argTypes: {
    gap: { control: "select", options: ["tight", "default", "loose"] },
    density: { control: "select", options: ["uniform", "tall"] },
  },
  args: {
    gap: "default",
    density: "uniform",
  },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <BentoGrid {...args}>
      <BentoCard span={8} accent>
        <BentoCardBody
          eyebrow="Featured"
          title="Payments overview"
          body="Track authorisations in real time."
        />
      </BentoCard>
      <BentoCard span={4} tone="subtle">
        <BentoCardBody title="Uptime" body="99.98% over the last 30 days." />
      </BentoCard>
      <BentoCard span={4} tone="brand">
        <BentoCardBody title="New feature" body="Instant transfers are now live." />
      </BentoCard>
      <BentoCard span={4} tone="corporate">
        <BentoCardBody title="ESG report" body="Q3 sustainability metrics." />
      </BentoCard>
      <BentoCard span={4}>
        <BentoCardBody title="Support" body="Median response time: 4 minutes." />
      </BentoCard>
    </BentoGrid>
  ),
};
