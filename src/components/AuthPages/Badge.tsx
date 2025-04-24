const Badge = ({ text }: { text: string }) => {
  return (
    <div className='border bg-[#FBFBFB] border-[#D5D5D5] text-[#5AC8A5] p-2 rounded-full px-7 py-[3px] text-[13px] tracking-wider font-medium max-w-max mt-2.5'>
      {text}
    </div>
  );
};

export default Badge;
