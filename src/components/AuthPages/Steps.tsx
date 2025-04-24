interface Props {
  step: number;
  title: string;
  des: string;
}
const Steps = ({ step, title, des }: Props) => {
  return (
    <div className='flex gap-6 mt-8'>
      <div className='text-xl flex-shrink-0 font-semibold h-[52px] w-[52px] rounded-full flex items-center justify-center bg-[#5AC8A5]'>
        {step}
      </div>
      <div className='flex flex-col gap-2'>
        <h4 className='text-lg font-semibold'>{title}</h4>
        <p className='text-sm text-[#494949]'>{des}</p>
      </div>
    </div>
  );
};

export default Steps;
