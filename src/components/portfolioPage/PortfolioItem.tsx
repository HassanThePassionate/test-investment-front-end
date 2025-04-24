import style from "./portfolio.module.css";
interface Props {
  icon: React.ReactNode;
  title: string;
  amount: string;
}
const PortfolioItem = ({ icon, title, amount }: Props) => {
  return (
    <div className={style.item}>
      <div className={style.content}>
        {icon}
        <h3>{amount}</h3>
      </div>
      <div>
        <p className='text-sm text-[#58626f] leading-[20px]'>{title}</p>
      </div>
    </div>
  );
};

export default PortfolioItem;
