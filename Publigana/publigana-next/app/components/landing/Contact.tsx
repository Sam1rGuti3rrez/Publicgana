
"use client";

import { FormEvent, useState } from "react";

type FieldName = "nombre" | "correo" | "ciudad";
type LeadRole = "usuario" | "negocio";

type FieldErrors = Partial<Record<FieldName, string>>;

export default function Contact() {
  const [role, setRole] = useState<LeadRole>("usuario");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    ciudad: "",
  });

  const handleRoleChange = (nextRole: LeadRole) => {
    if (nextRole === role || isSubmitting) {
      return;
    }

    setRole(nextRole);
    setFormData((prev) => ({ ...prev, nombre: "" }));
    setFieldErrors({});
    setErrorMessage(null);
    setShowSuccess(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id !== "nombre" && id !== "correo" && id !== "ciudad") {
      return;
    }

    const field = id as FieldName;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setShowSuccess(false);

    const errors: FieldErrors = {};

    if (!formData.nombre.trim()) {
      errors.nombre =
        role === "usuario"
          ? "Por favor, introduce tu nombre completo."
          : "Por favor, introduce el nombre de tu empresa o negocio.";
    }

    if (!formData.correo.trim()) {
      errors.correo = "Por favor, introduce tu correo electrónico.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo.trim())
    ) {
      errors.correo = "Introduce un correo electrónico válido.";
    }

    if (!formData.ciudad.trim()) {
      errors.ciudad = "Por favor, introduce tu ciudad.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          correo: formData.correo.trim(),
          ciudad: formData.ciudad.trim(),
          tipoUsuario: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "No fue posible registrar tu interés."
        );
      }

      setShowSuccess(true);
      setFieldErrors({});
      setFormData({
        nombre: "",
        correo: "",
        ciudad: "",
      });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No fue posible registrar tu interés.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: FieldName) =>
    `w-full rounded-[12px] border bg-[rgba(255,255,255,0.06)] px-[14px] py-[13px] text-[0.95rem] text-[#F6F1E7] placeholder:text-[rgba(246,241,231,0.4)] outline-none transition-all duration-200 focus:ring-2 ${
      fieldErrors[field]
        ? "border-[#FFD166] focus:border-[#FFD166] focus:ring-[rgba(255,209,102,0.18)]"
        : "border-[rgba(246,241,231,0.14)] focus:border-[#F5A623] focus:ring-[rgba(245,166,35,0.15)]"
    }`;

  const renderFieldError = (field: FieldName) => {
    const message = fieldErrors[field];

    if (!message) return null;

    return (
      <p
        id={`${field}-error`}
        role="alert"
        className="flex items-start gap-[8px] rounded-[8px] border border-[rgba(201,192,222,0.3)] bg-[rgba(15,6,38,0.25)] px-[10px] py-[8px] text-[0.8rem] leading-[1.5] text-[#E4D8F5] animate-in fade-in duration-200"
      >
        <span
          aria-hidden="true"
          className="mt-[1px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-[#FFD166] text-[0.68rem] font-bold text-[#FFD166]"
        >
          !
        </span>
        <span>{message}</span>
      </p>
    );
  };

  return (
    <section
      id="registro"
      className="px-0 py-[84px]"
      aria-label="Registro de interés"
    >
      <div className="mx-[24px] rounded-[28px] bg-[#2A0D5E] px-[48px] py-[64px] max-[880px]:mx-[12px] max-[880px]:px-[24px] max-[880px]:py-[40px]">
        <div className="mx-auto max-w-[1120px] px-0">
          <div className="grid grid-cols-2 items-start gap-[56px] max-[880px]:grid-cols-1">
            <div className="form-copy">
              <h2 className="mb-[16px] font-[Fraunces] text-[clamp(1.8rem,3.5vw,2.3rem)] font-[600] tracking-[-0.01em] text-[#F6F1E7]">
                Sé de los primeros en PubliGana
              </h2>

              <p className="text-[1.02rem] leading-[1.6] text-[#C9C0DE]">
                Estamos validando el modelo en Bogotá con negocios y usuarios
                reales. Déjanos tus datos y te avisamos en cuanto haya campañas
                disponibles en tu zona.
              </p>
            </div>

            <div>
              <form
                id="leadForm"
                noValidate
                className="flex flex-col gap-[14px]"
                onSubmit={handleSubmit}
              >
                <div
                  className="flex gap-[10px]"
                  role="group"
                  aria-label="Tipo de usuario"
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    aria-pressed={role === "usuario"}
                    onClick={() => handleRoleChange("usuario")}
                    className={`flex-1 cursor-pointer rounded-[10px] border px-[12px] py-[12px] text-center text-[0.9rem] font-[600] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                      role === "usuario"
                        ? "border-[#F5A623] bg-[rgba(212,165,55,0.14)] text-[#FFD166]"
                        : "border-[rgba(246,241,231,0.14)] bg-transparent text-[#C9C0DE] hover:border-[rgba(245,166,35,0.5)]"
                    }`}
                  >
                    Quiero ganar
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    aria-pressed={role === "negocio"}
                    onClick={() => handleRoleChange("negocio")}
                    className={`flex-1 cursor-pointer rounded-[10px] border px-[12px] py-[12px] text-center text-[0.9rem] font-[600] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                      role === "negocio"
                        ? "border-[#F5A623] bg-[rgba(212,165,55,0.14)] text-[#FFD166]"
                        : "border-[rgba(246,241,231,0.14)] bg-transparent text-[#C9C0DE] hover:border-[rgba(245,166,35,0.5)]"
                    }`}
                  >
                    Quiero anunciar
                  </button>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="nombre"
                    className="text-[0.85rem] font-[600] text-[#C9C0DE]"
                  >
                    {role === "usuario"
                      ? "Nombre completo"
                      : "Nombre de la empresa o negocio"}
                    <span className="ml-[4px] text-[#F5A623]">*</span>
                  </label>

                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    autoComplete="name"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder={
                      role === "usuario"
                        ? "Tu nombre completo"
                        : "Nombre de tu empresa o negocio"
                    }
                    required
                    aria-invalid={Boolean(fieldErrors.nombre)}
                    aria-describedby={
                      fieldErrors.nombre ? "nombre-error" : undefined
                    }
                    className={inputClass("nombre")}
                  />

                  {renderFieldError("nombre")}
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="correo"
                    className="text-[0.85rem] font-[600] text-[#C9C0DE]"
                  >
                    {role === "usuario"
                      ? "Correo electrónico"
                      : "Correo electrónico de contacto"}
                    <span className="ml-[4px] text-[#F5A623]">*</span>
                  </label>

                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    autoComplete="email"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tucorreo@email.com"
                    required
                    aria-invalid={Boolean(fieldErrors.correo)}
                    aria-describedby={
                      fieldErrors.correo ? "correo-error" : undefined
                    }
                    className={inputClass("correo")}
                  />

                  {renderFieldError("correo")}
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="ciudad"
                    className="text-[0.85rem] font-[600] text-[#C9C0DE]"
                  >
                    Ciudad
                    <span className="ml-[4px] text-[#F5A623]">*</span>
                  </label>

                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    autoComplete="address-level2"
                    value={formData.ciudad}
                    onChange={handleChange}
                    placeholder="Bogotá"
                    required
                    aria-invalid={Boolean(fieldErrors.ciudad)}
                    aria-describedby={
                      fieldErrors.ciudad ? "ciudad-error" : undefined
                    }
                    className={inputClass("ciudad")}
                  />

                  {renderFieldError("ciudad")}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-[8px] inline-flex items-center justify-center gap-[8px] rounded-[100px] border-none bg-[#F5A623] px-[26px] py-[14px] text-[0.95rem] font-[700] text-[#0F0626] shadow-[0_8px_24px_-8px_rgba(212,165,55,0.5)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_30px_-8px_rgba(212,165,55,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD166] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-[#0F0626]/30 border-t-[#0F0626]"
                      />
                      Enviando...
                    </>
                  ) : (
                    "Registrar mi interés"
                  )}
                </button>

                <p className="mt-[4px] text-[0.8rem] leading-[1.5] text-[#C9C0DE]">
                  <span className="text-[#F5A623]">✦</span> Sin spam. Solo te
                  escribimos cuando haya campañas disponibles.
                </p>

                {showSuccess && (
                  <div
                    role="status"
                    className="flex items-start gap-[10px] rounded-[12px] border border-[rgba(212,165,55,0.4)] bg-[rgba(212,165,55,0.12)] p-[16px] text-[0.92rem] leading-[1.5] text-[#F6F1E7]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#F5A623] font-bold text-[#0F0626]"
                    >
                      ✓
                    </span>
                    <span>
                      <span className="block font-[600] text-[#FFD166]">
                        ¡Registro recibido!
                      </span>
                      Gracias por tu interés en PubliGana.
                    </span>
                  </div>
                )}

                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-[10px] rounded-[12px] border border-[rgba(201,192,222,0.35)] bg-[rgba(15,6,38,0.3)] p-[16px] text-[0.92rem] leading-[1.5] text-[#E4D8F5]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[#FFD166] font-bold text-[#FFD166]"
                    >
                      !
                    </span>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}