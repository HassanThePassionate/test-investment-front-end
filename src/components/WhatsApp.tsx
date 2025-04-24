import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const WhatsApp = () => {
  const location = useLocation();
  const path = location.pathname;
  const isShowWhatsapp =
    path === "/admin/users" ||
    path === "/admin/dashboard" ||
    path === "/admin/registration-request" ||
    path === "/admin/investment-opportunities";
  return (
    <div className={cn("fixed bottom-10 right-10", isShowWhatsapp && "hidden")}>
      <a
        href='https://api.whatsapp.com/send?phone=+351 933 431 046&text=I%20am%20inquiring%20about%20the%20property%20listing'
        target='_blank'
        className='hover:scale-0.9 hover:shadow-lg'
      >
        <img
          src='/whatsapp-icon.svg'
          alt='whatsapp-icon'
          className='w-12 h-12'
        />
      </a>
    </div>
  );
};

export default WhatsApp;
