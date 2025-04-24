import style from "./dashboard.module.css";
interface Props {
  tile: string;
  amount: string;
  subInfo: string;
  icon: React.ReactNode;
}
const Card = ({ tile, amount, subInfo, icon }: Props) => {
  return (
    <div className='h-full bg-white border border-[#eaecee] rounded-[8px]'>
      <div className='p-6 '>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-1 w-full'>
            <div className='flex flex-col gap-1'>
              <div className='text-[#58626f] leading-[22px] text-sm font-normal'>
                {tile}
              </div>
              <span className='text-2xl font-semibold leading-[32px]'>
                {amount}
              </span>
            </div>
            <div className='self-start max-w-[42px]'>{icon}</div>
          </div>
          <div className={style.badge}>{subInfo}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
