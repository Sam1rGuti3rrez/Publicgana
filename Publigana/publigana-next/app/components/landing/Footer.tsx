export default function Footer() {
  return (
    <footer className="mt-[32px] border-t border-t-[rgba(246,241,231,0.14)] px-0 pb-[32px] pt-[48px]" aria-label="Pie de página">
      <div className="mx-auto flex max-w-[1120px] flex-col px-[16px] sm:px-[24px]">
        <div className="flex flex-col items-start justify-between gap-[16px] sm:flex-row sm:items-center sm:gap-[20px]">
          <div className="flex items-center gap-[10px] text-[1.15rem]">
            <img
              src="/images/logo.jpg"
              alt="PubliGana"
              className="block h-[44px] w-[44px] rounded-[10px] border border-[rgba(246,241,231,0.24)] object-cover object-top shadow-[0_8px_20px_rgba(0,0,0,0.32)]"
            />
            <span className="font-[700] text-[#F6F1E7]">PubliGana</span>
          </div>

          <nav className="flex w-full flex-wrap items-center gap-x-[18px] gap-y-[4px] text-[0.88rem] text-[#C9C0DE] sm:w-auto sm:gap-[24px]" aria-label="Enlaces del pie de página">
            <a href="mailto:hola@publigana.com" className="flex min-h-[40px] items-center transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">
              contacto@publigana.com
            </a>

            <a href="#como-funciona" className="flex min-h-[40px] items-center transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">
              Cómo funciona
            </a>

            <a href="#registro" className="flex min-h-[40px] items-center transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]">
              Contacto
            </a>
          </nav>
        </div>

        <p className="mt-[20px] text-left text-[0.8rem] text-[rgba(246,241,231,0.4)] sm:mt-[24px] sm:text-center">
          © 2026 PubliGana · publigana.com · Bogotá, Colombia
        </p>
      </div>
    </footer>
  );
}
