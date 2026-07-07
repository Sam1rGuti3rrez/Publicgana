import logo from "../../../assets/images/logo.jpg";

function Footer() {
  return (
    <footer
      className="mt-[32px] border-t border-t-[rgba(246,241,231,0.14)] px-0 pb-[32px] pt-[48px]"
      aria-label="Pie de página"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col px-[24px]">
        <div className="flex flex-wrap items-center justify-between gap-[20px]">
          <div className="text-[1.15rem]">
            <img
              src={logo}
              alt="PubliGana"
              className="block h-[34px] w-auto"
            />
          </div>

          <nav
            className="flex flex-wrap items-center gap-[24px] text-[0.88rem] text-[#C9C0DE]"
            aria-label="Enlaces del pie de página"
          >
            <a
              href="mailto:hola@publigana.com"
              className="transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              hola@publigana.com
            </a>

            <a
              href="#como-funciona"
              className="transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              Cómo funciona
            </a>

            <a
              href="#registro"
              className="transition-colors duration-150 hover:text-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              Contacto
            </a>
          </nav>
        </div>

        <p className="mt-[24px] text-center text-[0.8rem] text-[rgba(246,241,231,0.4)]">
          © 2026 PubliGana · publigana.com · Bogotá, Colombia
        </p>
      </div>
    </footer>
  );
}

export default Footer;