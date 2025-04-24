const ThreeDots = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      color='inherit'
    >
      <g clip-path='url(#3Dot_svg__a)' fill='currentColor'>
        <circle cx='12' cy='6' r='2'></circle>
        <circle cx='12' cy='12' r='2'></circle>
        <circle cx='12' cy='18' r='2'></circle>
      </g>
      <defs>
        <clipPath id='3Dot_svg__a'>
          <path fill='#fff' d='M0 0h24v24H0z'></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default ThreeDots;
