import {
  BadgeDollarSign, BookOpen, Building2, Calculator, ChartNoAxesCombined,
  ClipboardCheck, Clock3, Coins, Landmark, MapPin, MessagesSquare, PackageSearch,
  PanelsTopLeft, ReceiptText, RefreshCw, ShieldCheck, Store, TrendingUp,
  UsersRound, UtensilsCrossed, Wallet,
  type LucideIcon,
} from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  "/new-york": MapPin,
  "/restaurant-finance-services": Landmark,
  "/restaurant-accounting-services": Calculator,
  "/restaurant-bookkeeping-services": BookOpen,
  "/restaurant-payroll-services": BadgeDollarSign,
  "/restaurant-tax-services": ReceiptText,
  "/restaurant-compliance-services": ShieldCheck,
  "/restaurant-cfo-services": ChartNoAxesCombined,
  "/restaurant-financial-consulting": MessagesSquare,
  "/restaurant-back-office-services": PanelsTopLeft,
  "/restaurant-accounts-payable-services": ClipboardCheck,
  "/restaurant-cash-flow-management": Wallet,
  "/restaurant-food-cost-management": UtensilsCrossed,
  "/restaurant-labor-cost-management": Clock3,
  "/restaurant-tip-management": Coins,
  "/restaurant-inventory-cost-control": PackageSearch,
  "/restaurant-turnaround-consulting": RefreshCw,
  "/restaurant-profitability-consulting": TrendingUp,
  "/multi-location-restaurant-finance": Building2,
  "/outsourced-restaurant-finance-team": UsersRound,
  "/who-we-help/independent-restaurants": Store,
  "/who-we-help/multi-location-groups": Building2,
  "/who-we-help/performance-pressure": ChartNoAxesCombined,
};

export function ServiceIcon({ path }: { path: string }) {
  const Icon = serviceIcons[path] || BookOpen;
  return <Icon aria-hidden="true" size={32} strokeWidth={1.5} />;
}
