import Badge from "./Badge";
import Footer from "./Footer";
import LoginForm from "./LoginForm";
import Navbar from "./Navbar";

const Login = () => {
  return (
    <div className='bg-white'>
      <Navbar />
      <div className='flex items-center justify-center flex-col py-12'>
        <Badge text='Review' />
        <h2 className='text-6xl font-normal leading-[65px] text-center mt-5'>
          lroem ipsum <br /> ums devis{" "}
          <span className='text-[#23614E]'>dorivad</span>
        </h2>
        <LoginForm />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
