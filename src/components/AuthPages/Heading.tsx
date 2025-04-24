const Heading = ({ title }: { title: string }) => {
  return (
    <div className='flex items-center justify-between'>
      <h4 className='text-2xl font-medium'>{title}</h4>
      <img src='/RecaptchaLogo.svg.png' alt='RecaptchaLogo' />
    </div>
  );
};

export default Heading;
