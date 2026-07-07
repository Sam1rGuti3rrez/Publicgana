function HowItWorks() {
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
					<article className="border-t-[2px] border-t-[rgba(212,165,55,0.4)] pt-[18px]" aria-label="Paso 01">
						<span className="mb-[10px] block font-[Fraunces] text-[1.6rem] font-[700] text-[#F5A623]">01</span>
						<h3 className="mb-[8px] font-[Fraunces] text-[1.05rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
							El negocio publica
						</h3>
						<p className="text-[0.92rem] leading-[1.6] text-[#C9C0DE]">
							Define el contenido de su campaña y cuánto paga por participación.
						</p>
					</article>

					<article className="border-t-[2px] border-t-[rgba(212,165,55,0.4)] pt-[18px]" aria-label="Paso 02">
						<span className="mb-[10px] block font-[Fraunces] text-[1.6rem] font-[700] text-[#F5A623]">02</span>
						<h3 className="mb-[8px] font-[Fraunces] text-[1.05rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
							Tú compartes
						</h3>
						<p className="text-[0.92rem] leading-[1.6] text-[#C9C0DE]">
							Eliges la campaña y la compartes en tu WhatsApp, Instagram o Facebook.
						</p>
					</article>

					<article className="border-t-[2px] border-t-[rgba(212,165,55,0.4)] pt-[18px]" aria-label="Paso 03">
						<span className="mb-[10px] block font-[Fraunces] text-[1.6rem] font-[700] text-[#F5A623]">03</span>
						<h3 className="mb-[8px] font-[Fraunces] text-[1.05rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
							Se valida
						</h3>
						<p className="text-[0.92rem] leading-[1.6] text-[#C9C0DE]">
							Confirmamos que la publicación se hizo correctamente.
						</p>
					</article>

					<article className="border-t-[2px] border-t-[rgba(212,165,55,0.4)] pt-[18px]" aria-label="Paso 04">
						<span className="mb-[10px] block font-[Fraunces] text-[1.6rem] font-[700] text-[#F5A623]">04</span>
						<h3 className="mb-[8px] font-[Fraunces] text-[1.05rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
							Cobras
						</h3>
						<p className="text-[0.92rem] leading-[1.6] text-[#C9C0DE]">
							Tu ganancia queda disponible y la retiras cuando quieras.
						</p>
					</article>
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
