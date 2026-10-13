export default function CampaignDistribution() {
  return (
    <section className="px-0 pb-[52px] pt-[36px] sm:pb-[84px] sm:pt-[56px]">
      <div className="mx-auto max-w-[1120px] px-[16px] sm:px-[24px]">
        <div className="relative mx-auto max-w-[560px] rounded-[20px] border border-[rgba(246,241,231,0.14)] bg-[#1C0D42] p-[clamp(18px,5vw,32px)] sm:rounded-[24px]">
          <div className="mb-[18px] text-[0.78rem] font-[700] uppercase tracking-[0.08em] text-[#C9C0DE]">
            Así se reparte una campaña
          </div>

          <div className="mb-[18px] flex flex-col items-center justify-center gap-[2px] rounded-[16px] border border-dashed border-[rgba(212,165,55,0.4)] bg-[rgba(212,165,55,0.1)] p-[14px] text-center sm:flex-row sm:items-baseline sm:gap-[8px] sm:p-[18px]">
            <span className="font-[Fraunces] text-[clamp(1.8rem,8vw,2.2rem)] font-[700] leading-tight text-[#FFD166]">$50.000</span>
            <span className="text-[0.85rem] text-[#C9C0DE]">COP paga el negocio</span>
          </div>

          <div className="my-[6px] text-center text-[0.85rem] text-[#C9C0DE]">se reparte entre</div>

          <div className="grid grid-cols-1 gap-[12px] min-[521px]:grid-cols-2 min-[521px]:gap-[14px]">
            <div className="rounded-[14px] border border-[rgba(246,241,231,0.14)] bg-[rgba(255,255,255,0.05)] p-[16px] text-center sm:p-[18px]">
              <div className="font-[Fraunces] text-[1.6rem] font-[700] text-[#F6F1E7]">$30.000</div>
              <div className="mt-[4px] text-[0.78rem] text-[#C9C0DE]">Para quienes comparten</div>
            </div>

            <div className="rounded-[14px] border border-[rgba(212,165,55,0.35)] bg-[rgba(212,165,55,0.12)] p-[16px] text-center sm:p-[18px]">
              <div className="font-[Fraunces] text-[1.6rem] font-[700] text-[#FFD166]">$20.000</div>
              <div className="mt-[4px] text-[0.78rem] text-[#C9C0DE]">Gestión de PubliGana</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
