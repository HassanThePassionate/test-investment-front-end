import ChartStats from "@/components/svgs/ChartStats";
import CoinDroping from "@/components/svgs/CoinDroping";
import CoinHand from "@/components/svgs/CoinHand";
import Globe from "@/components/svgs/Globe";
import MoneyBag from "@/components/svgs/MoneyBag";
import Shield from "@/components/svgs/Shield";

export const portfolioData = [
  {
    icon: <MoneyBag />,
    title: "Total Invested",
    amount: "€0",
  },
  {
    icon: <CoinHand />,
    title: "Total repaid",
    amount: "€0",
  },
  {
    icon: <CoinDroping />,
    title: "Pending returns",
    amount: "€0",
  },
  {
    icon: <ChartStats />,
    title: "Average interest",
    amount: "0%",
  },
  {
    icon: <Globe />,
    title: "Countries",
    amount: "0",
  },
  {
    icon: <Shield />,
    title: "Secured loans",
    amount: "100%",
  },
];
