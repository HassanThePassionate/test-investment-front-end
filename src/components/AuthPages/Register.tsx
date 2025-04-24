import Badge from "./Badge";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import Logo from "./Logo";
import Steps from "./Steps";

const Register = () => {
  return (
    <div className='bg-white pt-12'>
      <main className='max-w-[1440px] mx-auto w-full px-6 flex items-center justify-center  bg-white gap-[100px] max-lg:flex-col'>
        <div className='flex flex-col lg:max-w-[30%]'>
          <Logo />
          <Badge text='Join Us' />
          <h1 className='text-[52px] leading-[60px] font-medium mt-4'>
            Fill out this form <br className='max-lg:hidden' /> let’s get in{" "}
            <br className='max-lg:hidden' /> touch
          </h1>
          <p className='text-sm text-[#494949] mt-8'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            sit amet urna non nisl accumsan tincidunt.
          </p>
          <Steps
            step={1}
            title='Preenche o forms'
            des='Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          />
          <Steps
            step={2}
            title='Aguarda o contacto da nossa equipa'
            des='Lorem ipsum dolor sit amet, consectetur adip.'
          />
        </div>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
