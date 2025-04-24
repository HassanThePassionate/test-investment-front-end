import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className='max-w-[1440px] mx-auto w-full sm:px-[160px] px-6  mt-[150px]   bg-white'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8'>
        {/* Company Info */}
        <div className='md:col-span-2'>
          <Logo />
          <p className='text-sm text-gray-600 mt-1'>
            Investimentos Imobiliários
          </p>
        </div>

        {/* Pages */}
        <div className='md:col-span-1'>
          <h3 className='font-medium mb-4'>Pages</h3>
          <ul className='space-y-2'>
            <li>
              <a href='/' className='text-sm text-gray-600 hover:text-gray-900'>
                Main Page
              </a>
            </li>
            <li>
              <a
                href='/about'
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href='/how-it-works'
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href='/contact'
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div className='md:col-span-1'>
          <h3 className='font-medium mb-4'>Socials</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>
                Instagram
              </a>
            </li>
            <li>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>
                TikTok
              </a>
            </li>
            <li>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>
                YouTube
              </a>
            </li>
            <li>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>
                aedIn
              </a>
            </li>
            <li>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>
                Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Learn */}
        <div className='md:col-span-1'>
          <h3 className='font-medium mb-4'>Learn</h3>
          <ul className='space-y-2'>
            <li>
              <a
                href='/faq'
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href='/support'
                className='text-sm text-gray-600 hover:text-gray-900'
              >
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='mt-12 pt-8 border-t border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between'>
          <p className='text-sm text-gray-500'>
            FlipWise © 2025 All rights reserved.
          </p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <a
              href='/privacy'
              className='text-sm text-gray-500 hover:text-gray-900'
            >
              Privacy Policy
            </a>
            <a
              href='/terms'
              className='text-sm text-gray-500 hover:text-gray-900'
            >
              Terms & Cookies
            </a>
          </div>
        </div>

        {/* Lorem ipsum text */}
        <p className='text-xs text-gray-400 mt-6 leading-relaxed'>
          Informação Importante: Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed dolor ut amet vitae non sed accumsan fringilla.
          Vivamus a elit sed magna fermentum mattis. Praesent vel viverra purus
          vel lacus. Sed ut elit ut ipsum porttitor faucibus. Fusce ut augue vel
          magna porttitor faucibus. Fusce faucibus porttitor faucibus. Fusce
          faucibus porttitor faucibus. Fusce faucibus porttitor faucibus.
          Viverra purus vel lacus vel lacinia. Sed sed elit ut ipsum porttitor
          faucibus. Fusce ut augue vel magna porttitor faucibus. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Mauris sed erat et sem egestas viverra. Curabitur sit
          amet metus porttitor, dapibus velit sed, tincidunt nisl. Suspendisse
          vitae nulla et nisi tempus vehicula.
        </p>
      </div>
    </footer>
  );
}
