import Bank from "@/components/svgs/Bank";
import FileSearch from "@/components/svgs/FileSearch";
import Money from "@/components/svgs/Money";
import Percentage from "@/components/svgs/Percentage";
import Referrals from "@/components/svgs/Referrals";
import Trade from "@/components/svgs/Trade";

export const dashboardData = [
  {
    title: "Total Investments",
    amount: "€0",
    subInfo: "€0 invested this month",
    icon: <Bank />,
  },
  {
    title: "Account Value",
    amount: "€0",
    subInfo: "€0 deposited this month",
    icon: <Money />,
  },
  {
    title: "Net Annual Return",
    amount: "0%",
    subInfo: "€0 earned in the past year",
    icon: <Percentage />,
  },
  {
    title: "Open loans",
    amount: "0",
    subInfo: "0 matching your filters",
    icon: <FileSearch />,
  },
  {
    title: "My trades",
    amount: "0",
    subInfo: "3638 available trades",
    icon: <Trade />,
  },
  {
    title: "My Referrals",
    amount: "0",
    subInfo: "€0 investment credit earned",
    icon: <Referrals />,
  },
];
