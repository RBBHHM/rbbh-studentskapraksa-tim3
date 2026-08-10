import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dock, dockItemClasses } from "./dock";

/**
 * Dock — a floating, pill-shaped switcher that hugs its own content instead
 * of stretching full-width. No cva variants; `dockItemClasses(active)`
 * exposes the item styling for consumers to apply to their own links.
 */
const meta = {
  title: "Components/Dock",
  component: Dock,
  tags: ["autodocs"],
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = ["Overview", "Components", "Patterns", "Foundations"];

export const Default: Story = {
  args: { label: "Section jumper", children: null },
  render: (args) => {
    function Wrapper() {
      const [active, setActive] = useState(items[0]);
      return (
        <Dock {...args}>
          {items.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={dockItemClasses(item === active)}
                onClick={() => setActive(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </Dock>
      );
    }
    return <Wrapper />;
  },
};
