import Item from "./Item";

const MenuItems = () => {
  return (
    <ul className='flex items-center md:flex-row flex-col '>
      <Item text='Dashboard' link='/' />
      <Item text='Invest' link='/invest' />
      <Item text='My Portfolio' link='/portfolio' />
    </ul>
  );
};

export default MenuItems;
