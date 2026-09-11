import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  business: z
    .string()
    .trim()
    .min(2, "Please enter the restaurant name.")
    .max(160),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  phone: z.string().max(40).default(""),
  locations: z.string().max(20).default(""),
  restaurantType: z.string().max(100).default(""),
  systems: z.string().max(500).default(""),
  concern: z.string().max(2000).default(""),
  timing: z.string().max(200).default(""),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please consent so we can respond to your enquiry.",
    }),
  }),
  website: z.string().max(0).default(""),
});
export type Lead = z.infer<typeof leadSchema>;
export const diagnosticSchema = z.object({
  locations: z.coerce.number().int().min(1).max(1000),
  restaurantType: z.enum([
    "Full service",
    "Quick service",
    "Cafe / bakery",
    "Bar / pub",
    "Other",
  ]),
  payroll: z.enum([
    "Straightforward",
    "Variable hours and tips",
    "Multiple teams or cycles",
  ]),
  systems: z.coerce.number().int().min(1).max(50),
  cadence: z.enum(["Weekly", "Monthly", "Irregular / unclear"]),
  food: z.enum(["Simple", "Several suppliers", "Complex inventory / recipes"]),
  concern: z.enum([
    "Time spent chasing",
    "Payroll and tips",
    "Food cost",
    "Cash visibility",
    "Growth",
    "Performance pressure",
  ]),
});
export function diagnose(input: z.infer<typeof diagnosticSchema>) {
  const gaps: string[] = [];
  if (input.locations > 1)
    gaps.push(
      "Confirm shared definitions and a responsible contact at each location.",
    );
  if (input.systems > 3)
    gaps.push(
      "Map how information moves between systems and who checks each handoff.",
    );
  if (input.payroll !== "Straightforward")
    gaps.push(
      "Check the cutoff, manager approvals and exception process for hours and tips.",
    );
  if (input.cadence !== "Weekly")
    gaps.push("Ask whether the reporting rhythm leaves enough time to act.");
  if (input.food !== "Simple")
    gaps.push(
      "Check whether supplier units, recipes and counts are comparable and current.",
    );
  if (!gaps.length)
    gaps.push(
      "Confirm that every recurring input, approval and next check has a named owner.",
    );
  return {
    profile:
      input.locations > 1
        ? "Start with consistency across locations"
        : gaps.length > 2
          ? "Look at how the jobs connect"
          : "Start with the recurring jobs",
    context: `${input.restaurantType} · Priority: ${input.concern.toLowerCase()}`,
    gaps,
    questions: [
      "What do you spend the most time chasing?",
      "Who approves the next action, and by when?",
      "Which question can your current reports not answer?",
    ],
    capability:
      input.concern === "Payroll and tips"
        ? "payroll-tips"
        : input.concern === "Food cost"
          ? "food-cost-vendors"
          : input.concern === "Performance pressure"
            ? "turnaround-support"
            : "reporting-cash-visibility",
  };
}
