import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

/**
 * Card — a bordered surface container composed from header/content/footer
 * primitives. Has no variants; layout is composed by the consumer.
 */
const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Account overview</CardTitle>
        <CardDescription>Summary of your current plan and usage.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">
          You are on the Business plan, renewing next month.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Manage plan</Button>
      </CardFooter>
    </Card>
  ),
};
