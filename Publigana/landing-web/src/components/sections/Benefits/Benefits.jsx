const primaryButtonClassName =
	"inline-flex items-center gap-[8px] rounded-[100px] border-none bg-[#F5A623] px-[26px] py-[14px] text-[0.95rem] font-[700] text-[#0F0626] shadow-[0_8px_24px_-8px_rgba(212,165,55,0.5)] transition-[transform,box-shadow] duration-150 ease-[ease] hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]";

function Benefits() {
	return (
		<section className="px-0 py-[84px]" aria-label="Beneficios para negocios y usuarios">
			<div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-[24px] px-[24px] max-[880px]:grid-cols-1">
				<article
					id="negocios"
					className="rounded-[20px] border border-[rgba(246,241,231,0.14)] bg-[#1C0D42] p-[36px]"
					aria-label="Para negocios"
				>
					<span className="mb-[12px] block text-[0.78rem] font-[700] uppercase tracking-[0.06em] text-[#FFD166]">
						Para negocios
					</span>

					<h3 className="mb-[14px] font-[Fraunces] text-[1.5rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
						Alcance real, pagado solo por resultados
					</h3>

					<ul className="mb-[24px] list-none">
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Publica tu campaña y define tu presupuesto.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Personas reales comparten tu marca en sus redes.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Pagas por participación, no por promesas de alcance.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Sin contratos largos: empiezas con una campaña piloto.
						</li>
					</ul>

					<a href="#registro" className={primaryButtonClassName}>
						Publicar mi primera campaña
					</a>
				</article>

				<article
					id="usuarios"
					className="rounded-[20px] border border-[rgba(246,241,231,0.14)] bg-[#1C0D42] p-[36px]"
					aria-label="Para usuarios"
				>
					<span className="mb-[12px] block text-[0.78rem] font-[700] uppercase tracking-[0.06em] text-[#FFD166]">
						Para ti
					</span>

					<h3 className="mb-[14px] font-[Fraunces] text-[1.5rem] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
						Gana dinero compartiendo lo que ya haces
					</h3>

					<ul className="mb-[24px] list-none">
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Sin inversión inicial, sin vender nada.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Compartes desde las redes que ya usas a diario.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Ganancias claras, definidas antes de compartir.
						</li>
						<li className="relative mb-[10px] pl-[22px] text-[0.95rem] leading-[1.6] text-[#C9C0DE] before:absolute before:left-0 before:top-[9px] before:h-[8px] before:w-[8px] before:rounded-[50%] before:bg-[#F5A623]">
							Retiros a Nequi, Daviplata o transferencia bancaria.
						</li>
					</ul>

					<a href="#registro" className={primaryButtonClassName}>
						Registrar mi interés
					</a>
				</article>
			</div>
		</section>
	);
}

export default Benefits;
