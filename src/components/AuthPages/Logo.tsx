const Logo = ({ width = 100 }: { width?: number }) => {
  return (
    <div className='mb-1.5'>
      <img src='/FlipWise.png' alt='' width={width} />
    </div>
  );
};

export default Logo;
