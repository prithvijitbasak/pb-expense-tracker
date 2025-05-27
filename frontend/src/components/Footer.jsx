const Footer = () => {
  return (
    <>
      <div className="footer-wrapper bg-[var(--top-color)]">
        <div className="container">
          <div className="px-4 py-5">
            <div className="flex justify-center items-center gap-x-3 text-white">
              <span className="block text-xl">PB Expense Tracker</span> |
              <span className="text-l block">
                Developed by{" "}
                <a href="https://prithvijitbasak.netlify.app/" className="underline underline-offset-2">
                  Prithvijit Basak
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
