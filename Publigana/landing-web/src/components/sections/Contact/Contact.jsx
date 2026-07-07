import { useState } from "react";

function Contact() {
	const [role, setRole] = useState("usuario");
	const [showSuccess, setShowSuccess] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		event.currentTarget.reset();
		setShowSuccess(true);

		window.setTimeout(() => {
			setShowSuccess(false);
		}, 5000);
	};

	return (
		<section id="registro" className="px-0 py-[84px]" aria-label="Registro de interés">
			<div className="mx-[24px] rounded-[28px] bg-[#2A0D5E] px-[48px] py-[64px] max-[880px]:mx-[12px] max-[880px]:px-[24px] max-[880px]:py-[40px]">
				<div className="mx-auto max-w-[1120px] px-0">
					<div className="grid grid-cols-2 items-start gap-[56px] max-[880px]:grid-cols-1">
						<div className="form-copy">
							<h2 className="mb-[16px] font-[Fraunces] text-[clamp(1.8rem,3.5vw,2.3rem)] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
								Sé de los primeros en PubliGana
							</h2>
							<p className="text-[1.02rem] leading-[1.6] text-[#C9C0DE]">
								Estamos validando el modelo en Bogotá con negocios y usuarios reales. Déjanos tus datos y te avisamos en cuanto haya campañas disponibles en tu zona.
							</p>
						</div>

						<div>
							<form id="leadForm" className="flex flex-col gap-[14px]" onSubmit={handleSubmit}>
								<div className="flex gap-[10px]" aria-label="Tipo de usuario">
									<button
										type="button"
										onClick={() => setRole("usuario")}
										className={`flex-1 cursor-pointer rounded-[10px] border px-[12px] py-[12px] text-center text-[0.9rem] font-[600] transition-all duration-150 ${
											role === "usuario"
												? "border-[#F5A623] bg-[rgba(212,165,55,0.14)] text-[#FFD166]"
												: "border-[rgba(246,241,231,0.14)] bg-transparent text-[#C9C0DE]"
										}`}
										aria-label="Quiero ganar"
									>
										Quiero ganar
									</button>

									<button
										type="button"
										onClick={() => setRole("negocio")}
										className={`flex-1 cursor-pointer rounded-[10px] border px-[12px] py-[12px] text-center text-[0.9rem] font-[600] transition-all duration-150 ${
											role === "negocio"
												? "border-[#F5A623] bg-[rgba(212,165,55,0.14)] text-[#FFD166]"
												: "border-[rgba(246,241,231,0.14)] bg-transparent text-[#C9C0DE]"
										}`}
										aria-label="Tengo un negocio"
									>
										Tengo un negocio
									</button>
								</div>

								<div className="flex flex-col gap-[6px]">
									<label htmlFor="nombre" className="text-[0.85rem] font-[600] text-[#C9C0DE]">
										Nombre completo
									</label>
									<input
										type="text"
										id="nombre"
										placeholder="Tu nombre"
										required
										className="rounded-[10px] border border-[rgba(246,241,231,0.14)] bg-[rgba(255,255,255,0.06)] px-[14px] py-[13px] text-[0.95rem] text-[#F6F1E7] placeholder:text-[rgba(246,241,231,0.4)] focus:border-[#F5A623] focus:outline-none"
									/>
								</div>

								<div className="flex flex-col gap-[6px]">
									<label htmlFor="correo" className="text-[0.85rem] font-[600] text-[#C9C0DE]">
										Correo electrónico
									</label>
									<input
										type="email"
										id="correo"
										placeholder="tucorreo@email.com"
										required
										className="rounded-[10px] border border-[rgba(246,241,231,0.14)] bg-[rgba(255,255,255,0.06)] px-[14px] py-[13px] text-[0.95rem] text-[#F6F1E7] placeholder:text-[rgba(246,241,231,0.4)] focus:border-[#F5A623] focus:outline-none"
									/>
								</div>

								<div className="flex flex-col gap-[6px]">
									<label htmlFor="ciudad" className="text-[0.85rem] font-[600] text-[#C9C0DE]">
										Ciudad
									</label>
									<input
										type="text"
										id="ciudad"
										placeholder="Bogotá"
										required
										className="rounded-[10px] border border-[rgba(246,241,231,0.14)] bg-[rgba(255,255,255,0.06)] px-[14px] py-[13px] text-[0.95rem] text-[#F6F1E7] placeholder:text-[rgba(246,241,231,0.4)] focus:border-[#F5A623] focus:outline-none"
									/>
								</div>

								<button
									type="submit"
									className="mt-[8px] inline-flex items-center gap-[8px] rounded-[100px] border-none bg-[#F5A623] px-[26px] py-[14px] text-[0.95rem] font-[700] text-[#0F0626] shadow-[0_8px_24px_-8px_rgba(212,165,55,0.5)] transition-[transform,box-shadow] duration-150 ease-[ease] hover:-translate-y-[2px]"
								>
									Registrar mi interés
								</button>

								<p className="mt-[4px] text-[0.8rem] text-[#C9C0DE]">
									Sin spam. Solo te escribimos cuando haya campañas disponibles.
								</p>

								<div
									id="successMsg"
									className={`${showSuccess ? "block" : "hidden"} rounded-[12px] border border-[rgba(212,165,55,0.4)] bg-[rgba(212,165,55,0.12)] p-[18px] text-[0.95rem] text-[#F6F1E7]`}
								>
									¡Listo! Te avisaremos en cuanto haya campañas disponibles para ti.
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Contact;
