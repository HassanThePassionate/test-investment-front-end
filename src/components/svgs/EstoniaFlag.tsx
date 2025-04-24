const EstoniaFlag = () => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      color='inherit'
    >
      <rect x='2' y='2' width='20' height='20' rx='10' fill='#3D9BE0'></rect>
      <mask
        id='Estonia_svg__a'
        maskUnits='userSpaceOnUse'
        x='2'
        y='2'
        width='20'
        height='20'
        style={{ maskType: "alpha" }}
      >
        <rect x='2' y='2' width='20' height='20' rx='10' fill='#fff'></rect>
      </mask>
      <g mask='url(#Estonia_svg__a)'>
        <path fill='#3D9BE0' d='M0 2h24v8H0z'></path>
        <path fill='#000' d='M0 9h24v6H0z'></path>
        <path fill='#fff' d='M0 15h24v8H0z'></path>
      </g>
    </svg>
  );
};

export default EstoniaFlag;
