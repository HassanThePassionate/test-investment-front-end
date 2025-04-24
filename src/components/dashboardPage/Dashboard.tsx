import { dashboardData } from "@/constant/dashboardData";
import Card from "./Card";
import InvestmentDashboard from "./InvestmentBoard";

const Dashboard = () => {
  return (
    <div className='flex flex-col w-full gap-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-full'>
        {dashboardData.map((item, i) => (
          <Card
            key={i}
            tile={item.title}
            amount={item.amount}
            subInfo={item.subInfo}
            icon={item.icon}
          />
        ))}
      </div>
      <InvestmentDashboard />
    </div>
  );
};

export default Dashboard;
