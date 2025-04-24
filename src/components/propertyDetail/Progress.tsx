import style from "./property.module.css";
const Progress = () => {
  return (
    <div className='relative'>
      <div className={style["progress-content"]}>
        <div className='sm:text-2xl text-base leading-[32px] font-medium whitespace-nowrap'>
          80%
        </div>
        <div className='text-[#58626f] leading-[18px] text-xs font-medium whitespace-nowrap text-center'>
          raised
        </div>
      </div>
      <svg viewBox='0 0 32 32' className={style.progress}>
        <circle
          r='16'
          cx='16'
          cy='16'
          className={style["progress-circle1"]}
        ></circle>
        <circle
          className={style["progress-circle2"]}
          values='79.73408769448373'
          r='16'
          cx='16'
          cy='16'
        ></circle>
      </svg>
    </div>
  );
};

export default Progress;
