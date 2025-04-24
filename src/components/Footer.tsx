export default function Footer() {
  return (
    <footer className='bg-[#CEE8F4] py-10 px-4'>
      <div className='max-w-7xl pt-[20px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        <div>
          <h3 className='font-bold text-sm text-gray-800 mb-6 '>Estateguru</h3>
          <ul className='space-y-3'>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Our story
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Careers
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Knowledge hub
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                News & Press
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Annual Reports
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Statistics & Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Useful Links Column */}
        <div>
          <h3 className='font-bold text-sm text-gray-800 mb-6 '>
            Useful Links
          </h3>
          <ul className='space-y-3'>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                How to invest
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                How to get funding
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Referral program
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Price list
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Press kit
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h3 className='font-bold text-sm text-gray-800 mb-6 '>Legal</h3>
          <ul className='space-y-3'>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                User terms
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Privacy policy
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                General loan terms
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Conflicts of interest policy
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Investor Risk Statement
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Lemonway - Terms & Conditions
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Referral - Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Help Center Column */}
        <div>
          <h3 className='font-bold text-sm text-gray-800 mb-6 '>Help Center</h3>
          <ul className='space-y-3'>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                FAQs
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Contact & Support
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                Complaints handling policy
              </a>
            </li>
            <li>
              <a href='#' className='text-gray-700 hover:underline text-sm'>
                File a complaint
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
