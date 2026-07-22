function CampaignDistribution() {
  return (
    <section className="px-0 pb-[84px] pt-[56px]">
      <div className="mx-auto max-w-[1120px] px-[24px]">
        <div className="relative mx-auto max-w-[560px] rounded-[24px] border border-[rgba(246,241,231,0.14)] bg-[#1C0D42] p-[32px]">
          <div className="mb-[18px] text-[0.78rem] font-[700] uppercase tracking-[0.08em] text-[#C9C0DE]">
            Así se reparte una campaña
          </div>

          <div className="mb-[18px] flex items-baseline justify-center gap-[8px] rounded-[16px] border border-dashed border-[rgba(212,165,55,0.4)] bg-[rgba(212,165,55,0.1)] p-[18px]">
            <span className="font-[Fraunces] text-[2.2rem] font-[700] text-[#FFD166]">$50.000</span>
            <span className="text-[0.85rem] text-[#C9C0DE]">COP paga el negocio</span>
          </div>

          <div className="my-[6px] text-center text-[0.85rem] text-[#C9C0DE]">se reparte entre</div>

          <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
            <div className="rounded-[14px] border border-[rgba(246,241,231,0.14)] bg-[rgba(255,255,255,0.05)] p-[18px] text-center">
              <div className="font-[Fraunces] text-[1.6rem] font-[700] text-[#F6F1E7]">$30.000</div>
              <div className="mt-[4px] text-[0.78rem] text-[#C9C0DE]">Para quienes comparten</div>
            </div>

            <div className="rounded-[14px] border border-[rgba(212,165,55,0.35)] bg-[rgba(212,165,55,0.12)] p-[18px] text-center">
              <div className="font-[Fraunces] text-[1.6rem] font-[700] text-[#FFD166]">$20.000</div>
              <div className="mt-[4px] text-[0.78rem] text-[#C9C0DE]">Gestión de PubliGana</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CampaignDistribution;