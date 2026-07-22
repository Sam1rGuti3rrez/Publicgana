import heroBanner from "../../../assets/images/hero-banner.jpg";

const primaryButtonClassName =
	"inline-flex items-center gap-[8px] rounded-[100px] border-none bg-[#F5A623] px-[26px] py-[14px] text-[0.95rem] font-[700] text-[#0F0626] shadow-[0_8px_24px_-8px_rgba(212,165,55,0.5)] transition-[transform,box-shadow] duration-150 ease-[ease] hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]";

const secondaryButtonClassName =
	"inline-flex items-center gap-[8px] rounded-[100px] border border-[rgba(246,241,231,0.14)] bg-transparent px-[26px] py-[14px] text-[0.95rem] font-[700] text-[#F6F1E7] transition-[transform,border-color] duration-150 ease-[ease] hover:-translate-y-[2px] hover:border-[#FFD166] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]";

function Hero() {
	return (
		<section className="relative px-0 pb-0 pt-[48px]" id="inicio">
			<div className="mx-auto max-w-[1120px] px-[20px] sm:px-[24px]">
				<div className="mb-[52px] flex flex-col gap-[34px] lg:gap-[40px]">
					<div className="flex flex-col items-center text-center lg:items-start lg:text-left">
						<span className="mb-[24px] inline-flex items-center gap-[8px] rounded-[100px] border border-[rgba(212,165,55,0.35)] bg-[rgba(212,165,55,0.08)] px-[14px] py-[7px] text-[0.8rem] font-[700] uppercase tracking-[0.08em] text-[#FFD166]">
							● Próximamente en Colombia
						</span>

						<h1 className="mb-[22px] max-w-[820px] font-[Fraunces] text-[clamp(2.2rem,4.8vw,3.6rem)] leading-[1.06] tracking-[-0.01em] text-[#F6F1E7]">
							Comparte publicidad. <em className="text-[#F5A623] not-italic italic">Gana dinero real.</em>
						</h1>

						<p className="mb-[34px] max-w-[620px] text-[1.05rem] leading-[1.6] text-[#C9C0DE] sm:text-[1.12rem] lg:text-[1.15rem]">
							PubliGana conecta negocios locales con personas que comparten su publicidad en WhatsApp, Instagram y Facebook — y reciben una parte de lo que el negocio paga por cada campaña.
						</p>

						<div className="flex flex-wrap justify-center gap-[14px] lg:justify-start">
							<a href="#registro" className={primaryButtonClassName}>
								Quiero ganar compartiendo
							</a>

							<a
								href="app-demo.html"
								target="_blank"
								rel="noopener"
								className={secondaryButtonClassName}
							>
								Ver demo de la app
							</a>
						</div>
					</div>

					<div className="mx-auto w-full max-w-[1120px] overflow-hidden rounded-[20px] border border-[rgba(246,241,231,0.14)] shadow-[0_20px_60px_-20px_rgba(123,47,190,0.45)]">
						<img
							src={heroBanner}
							alt="Banner de PubliGana con app móvil y redes sociales"
							className="block h-auto w-full object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
