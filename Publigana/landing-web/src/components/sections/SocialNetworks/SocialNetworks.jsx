import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";

const socialNetworks = [
	{ name: "WhatsApp", icon: FaWhatsapp, iconClassName: "text-[#25D366]",url: "https://wa.me/573053030303" },
	{ name: "Instagram", icon: FaInstagram, iconClassName: "text-[#E4405F]", url: "https://www.instagram.com/publi_gana/" },
	{ name: "Facebook", icon: FaFacebookF, iconClassName: "text-[#1877F2]", url: "https://www.facebook.com/" },
	{ name: "TikTok", icon: FaTiktok, iconClassName: "text-[#F6F1E7]", url: "https://www.tiktok.com/@publi_gana?_r=1&_t=ZS-98EXmWtZJOX" },
	
];

function SocialNetworks() {
	return (
		<section className="px-0 py-[84px]" aria-label="Redes contempladas">
			<div className="mx-auto max-w-[1120px] px-[24px]">
				<div className="mb-[48px] max-w-[600px]">
					<span className="mb-[16px] inline-flex items-center gap-[8px] rounded-[100px] border border-[rgba(212,165,55,0.35)] bg-[rgba(212,165,55,0.08)] px-[14px] py-[7px] text-[0.8rem] font-[700] uppercase tracking-[0.08em] text-[#FFD166]">
						Redes contempladas
					</span>

					<h2 className="font-[Fraunces] text-[clamp(1.8rem,3.5vw,2.4rem)] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
						Comparte desde donde ya estás
					</h2>
				</div>

				<div className="flex flex-wrap gap-[14px]">
					{socialNetworks.map(({ name, icon: Icon, iconClassName, url }) => (
						<a
							key={name}
							href={url}
							target="_blank"
							rel="noopener"
							className="inline-flex items-center gap-[10px] rounded-[100px] border border-[rgba(246,241,231,0.14)] px-[18px] py-[10px] text-[0.92rem] font-[600] text-[#C9C0DE]"
						>
							<span className="inline-flex h-[24px] w-[24px] items-center justify-center rounded-[999px] bg-[rgba(246,241,231,0.06)]">
								<Icon className={`h-[14px] w-[14px] ${iconClassName}`} aria-hidden="true" />
							</span>
							{name}
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

export default SocialNetworks;
