import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, LayoutDashboard, Settings, Users } from "lucide-react";

import { SideNav, type SideNavSection } from "./side-nav";

/**
 * SideNav — in-flow sidebar navigation that collapses to an icon rail rather
 * than disappearing. `collapsible` toggles the collapse control.
 */
const meta = {
  title: "Components/SideNav",
  component: SideNav,
  tags: ["autodocs"],
  argTypes: {
    collapsible: { control: "boolean" },
    collapsed: { control: "boolean" },
  },
  args: {
    label: "Primary",
    collapsible: true,
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections: readonly SideNavSection[] = [
  {
    id: "main",
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "customers", label: "Customers", icon: Users, badge: "12" },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [{ id: "settings", label: "Settings", icon: Settings }],
  },
];

export const Default: Story = {
  args: { sections, activeId: "dashboard", onSelect: () => {} },
  render: (args) => {
    function Wrapper() {
      const [activeId, setActiveId] = useState("dashboard");
      return (
        <div className="h-96">
          <SideNav {...args} sections={sections} activeId={activeId} onSelect={setActiveId} />
        </div>
      );
    }
    return <Wrapper />;
  },
};
