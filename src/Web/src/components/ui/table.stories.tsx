import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/**
 * Table — composed from header/body/row/cell primitives. No visual variants;
 * density and emphasis are set by the consuming layout.
 */
const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { id: "INV-001", customer: "Acme GmbH", status: "success" as const, amount: "€1,240.00" },
  { id: "INV-002", customer: "Nord Bau AG", status: "warning" as const, amount: "€860.00" },
  { id: "INV-003", customer: "Alpin Retail", status: "danger" as const, amount: "€3,120.00" },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.customer}</TableCell>
            <TableCell>
              <Badge tone={row.status}>{row.status}</Badge>
            </TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
