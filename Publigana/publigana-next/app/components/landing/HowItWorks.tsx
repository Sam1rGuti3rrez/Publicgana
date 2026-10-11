export default function HowItWorks() {
  return (
    <section id="como-funciona" className="px-0 py-[84px]" aria-label="Cómo funciona PubliGana">
      <div className="mx-auto max-w-[1120px] px-[24px]">
        <div className="mb-[48px] max-w-[600px]">
          <span className="mb-[16px] inline-flex items-center gap-[8px] rounded-[100px] border border-[rgba(212,165,55,0.35)] bg-[rgba(212,165,55,0.08)] px-[14px] py-[7px] text-[0.8rem] font-[700] uppercase tracking-[0.08em] text-[#FFD166]">
            Cómo funciona
          </span>

          <h2 className="font-[Fraunces] text-[clamp(1.8rem,3.5vw,2.4rem)] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
            De la campaña al pago, en cuatro pasos
          </h2>

          <p className="mt-[14px] text-[1.05rem] leading-[1.6] text-[#C9C0DE]">
            El proceso es simple tanto para el negocio que paga como para la persona que comparte.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-[24px] max-[880px]:grid-cols-2 max-[520px]:grid-cols-1">
          {[
            ["01", "El negocio publica", "Define el contenido de su campaña y cuánto paga por participación."],
            ["02", "Tú compartes", "Eliges la campaña y la compartes en tu WhatsApp, Instagram o Facebook."],
            ["03", "Se valida", "Confirmamos que la publicación se hizo correctamente."],
            ["04", "Cobras", "Tu ganancia queda disponible y la retiras cuando quieras."],
          ].map(([step, title, description]) => (
            <article key={step} className="border-t-[2px] border-t-[rgba(212,165,55,0.4)] pt-[18px]" aria-label={`Paso ${step}`}>
              <span className="mb-[10px] block font-[Fraunces] text-[1.6rem] font-[700] text-[#F5A623]">{step}</span>
              <h3 className="mb-[8px] font-[Fraunces] text-[1.05rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
                {title}
              </h3>
              <p className="text-[0.92rem] leading-[1.6] text-[#C9C0DE]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
