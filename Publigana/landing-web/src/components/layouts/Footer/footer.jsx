import logo from "../../../assets/images/logo.jpg";

function Footer() {
  return (
    <footer
      className="mt-[32px] border-t border-t-[rgba(246,241,231,0.14)] pt-[60px] pb-[40px]"
      aria-label="Pie de página"
    >
      <div className="mx-auto flex max-w-[1120px] flex-col px-[24px]">
        <div className="flex flex-wrap items-center justify-between gap-[20px]">
          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="PubliGana"
              className="block h-[95px] w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Navegación */}
          <nav
            className="flex flex-wrap items-center gap-[24px] text-[0.88rem] text-[#C9C0DE]"
            aria-label="Enlaces del pie de página"
          >
            <a
              href="mailto:contacto@publigana.com"
              className="transition-colors duration-150 hover:text-[#FFD166]"
            >
              Contacto@publigana.com
            </a>

            <a
              href="#como-funciona"
              className="transition-colors duration-150 hover:text-[#FFD166]"
            >
              Cómo funciona
            </a>

            <a
              href="#registro"
              className="transition-colors duration-150 hover:text-[#FFD166]"
            >
              Registro
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <p className="mt-[28px] text-center text-[0.8rem] text-[rgba(246,241,231,0.4)]">
          © 2026 PubliGana · publigana.com · Bogotá, Colombia
        </p>
      </div>
    </footer>
  );
}

export default Footer;