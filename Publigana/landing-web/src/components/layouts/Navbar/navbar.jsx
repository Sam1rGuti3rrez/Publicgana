import { useEffect, useRef, useState } from "react";
import logo from "../../../assets/images/logo.jpg";

const navItems = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#negocios", label: "Para negocios" },
  { href: "#usuarios", label: "Para ti" },
  { href: "#registro", label: "Contacto" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuContainerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={menuContainerRef}
      className="sticky top-0 z-50 border-b border-[rgba(246,241,231,0.14)] bg-[rgba(31,17,71,0.85)] backdrop-blur-[10px]"
    >
      <div className="flex items-center justify-between px-[24px] py-[18px]">
        <div className="flex items-center gap-[10px]">
          <img src={logo} alt="PubliGana" className="block h-[65px] w-[65px]" />
        </div>

        <nav aria-label="Navegación principal" className="hidden items-center gap-[32px] min-[881px]:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.95rem] font-[500] text-inherit opacity-80 transition-opacity duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#registro"
          className="hidden rounded-[100px] bg-[#F5A623] px-[20px] py-[10px] text-[0.9rem] font-[700] text-[#0F0626] min-[881px]:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
        >
          Unirme
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="hidden border-none bg-transparent px-[15px] py-[10px] text-[1.5rem] text-[#F6F1E7] min-[0px]:max-[880px]:block min-[0px]:max-[880px]:-mx-[15px] min-[0px]:max-[880px]:-my-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
        >
          <span aria-hidden="true">☰</span>
        </button>
      </div>

      <div
        id="mobile-nav-menu"
        aria-hidden={!isMenuOpen}
        className={`min-[881px]:hidden overflow-hidden border-t border-[rgba(246,241,231,0.14)] transition-[max-height,opacity,visibility] duration-200 ease-out ${
          isMenuOpen
            ? "visible max-h-[320px] opacity-100"
            : "invisible pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Navegación principal móvil" className="flex flex-col px-[24px] py-[16px]">
          {navItems.map((item) => (
            <a
              key={`mobile-${item.href}`}
              href={item.href}
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className="py-[10px] text-[0.95rem] font-[500] text-inherit opacity-80 transition-opacity duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#registro"
            onClick={closeMenu}
            tabIndex={isMenuOpen ? 0 : -1}
            className="mt-[8px] inline-flex w-fit rounded-[100px] bg-[#F5A623] px-[20px] py-[10px] text-[0.9rem] font-[700] text-[#0F0626] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
          >
            Unirme
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;