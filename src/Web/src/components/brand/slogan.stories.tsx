import type { Meta, StoryObj } from "@storybook/react-vite";

import { LocalizationTestProvider } from "@/localization/testing/localization-test-provider";

import { Slogan } from "./slogan";

/**
 * The brand claim, set the way RBI sets it: a three-word statement where the
 * middle word recedes in a lighter cut. Wording comes from localization
 * content (`common.brand.slogan`), never a component prop — the story
 * provides in-memory resources so it renders without the live translation
 * pipeline.
 */
const meta = {
  title: "Brand/Slogan",
  component: Slogan,
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      options: ["span", "p", "div", "h1", "h2"],
    },
    withStop: { control: "boolean" },
  },
  args: {
    as: "span",
    withStop: false,
  },
  decorators: [
    (Story) => (
      <LocalizationTestProvider
        resources={{
          en: {
            common: {
              brand: {
                slogan: {
                  lead: "Make it",
                  accent: "happen",
                  tail: "together",
                },
              },
            },
          },
        }}
      >
        <Story />
      </LocalizationTestProvider>
    ),
  ],
} satisfies Meta<typeof Slogan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStop: Story = { args: { withStop: true } };
