
"use client";

import { FormEvent, useEffect, useState } from "react";
import { changeRegistrationDepartment } from "@/app/lib/location-form";

type FieldName =
  | "nombre"
  | "correo"
  | "departmentCode"
  | "municipalityCode"
  | "locality"
  | "residencyConfirmed";
type LeadRole = "usuario" | "negocio";

type FieldErrors = Partial<Record<FieldName, string>>;

type Municipality = {
  code: string;
  name: string;
  departmentCode: string;
  department: string;
};

type Department = {
  code: string;
  name: string;
};

const INVALID_LOCATION_CATALOG_MESSAGE =
  "El catálogo geográfico recibido no tiene el formato esperado. Recarga la página e inténtalo nuevamente.";

function isLocationCatalog(
  value: unknown,
): value is { departments: Department[]; municipalities: Municipality[] } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const catalog = value as Record<string, unknown>;

  return (
    Array.isArray(catalog.departments) &&
    catalog.departments.length > 0 &&
    catalog.departments.every(
      (department) =>
        typeof department?.code === "string" &&
        typeof department?.name === "string",
    ) &&
    Array.isArray(catalog.municipalities) &&
    catalog.municipalities.length > 0 &&
    catalog.municipalities.every(
      (municipality) =>
        typeof municipality?.code === "string" &&
        typeof municipality?.name === "string" &&
        typeof municipality?.departmentCode === "string" &&
        typeof municipality?.department === "string",
    )
  );
}

export default function Contact() {
  const [role, setRole] = useState<LeadRole>("usuario");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [residencyConfirmed, setResidencyConfirmed] = useState(false);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalitiesLoading, setMunicipalitiesLoading] = useState(true);
  const [municipalitiesError, setMunicipalitiesError] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    departmentCode: "",
    municipalityCode: "",
    locality: "",
  });

  useEffect(() => {
    let active = true;

    fetch("/api/municipios?contract=2", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No fue posible cargar los municipios.");
        }

        const catalog: unknown = await response.json();

        if (!isLocationCatalog(catalog)) {
          throw new Error(INVALID_LOCATION_CATALOG_MESSAGE);
        }

        return catalog;
      })
      .then((data) => {
        if (active) {
          setMunicipalities(data.municipalities);
          setDepartments(data.departments);
          setMunicipalitiesError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setMunicipalitiesError(
            error instanceof Error &&
              error.message === INVALID_LOCATION_CATALOG_MESSAGE
              ? INVALID_LOCATION_CATALOG_MESSAGE
              : "No fue posible cargar los municipios colombianos. Intenta recargar la página.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setMunicipalitiesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const availableMunicipalities = municipalities.filter(
    (municipality) =>
      municipality.departmentCode === formData.departmentCode,
  );

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    if (
      id !== "nombre" &&
      id !== "correo" &&
      id !== "departmentCode" &&
      id !== "municipalityCode" &&
      id !== "locality"
    ) {
      return;
    }

    const field = id as FieldName;

    setFormData((prev) =>
      field === "departmentCode"
        ? changeRegistrationDepartment(prev, value)
        : {
            ...prev,
            [field]: value,
            ...(field === "municipalityCode" ? { locality: "" } : {}),
          },
    );

    setFieldErrors((prev) => ({
      ...prev,
      [field]: undefined,
      ...(field === "departmentCode"
        ? { municipalityCode: undefined, locality: undefined }
        : {}),
      ...(field === "municipalityCode" ? { locality: undefined } : {}),
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

    if (!formData.departmentCode) {
      errors.departmentCode = "Selecciona tu departamento de residencia.";
    }

    if (!formData.municipalityCode) {
      errors.municipalityCode =
        "Selecciona el municipio colombiano donde resides.";
    }

    if (!residencyConfirmed) {
      errors.residencyConfirmed =
        "Confirma que resides actualmente en Colombia para continuar.";
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
          tipoUsuario: role,
          countryCode: "CO",
          residencyConfirmed: true,
          departmentCode: formData.departmentCode,
          municipalityCode: formData.municipalityCode,
          locality: formData.locality,
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
        departmentCode: "",
        municipalityCode: "",
        locality: "",
      });
      setResidencyConfirmed(false);

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
    `min-h-[50px] w-full rounded-[12px] border bg-[rgba(15,6,38,0.48)] px-[14px] py-[12px] text-[0.95rem] text-[#F6F1E7] placeholder:text-[rgba(201,192,222,0.58)] outline-none transition-colors duration-200 focus-visible:border-[#FFD166] focus-visible:ring-2 focus-visible:ring-[rgba(255,209,102,0.22)] disabled:cursor-not-allowed disabled:border-[rgba(201,192,222,0.12)] disabled:bg-[rgba(255,255,255,0.025)] disabled:text-[rgba(201,192,222,0.58)] disabled:opacity-100 ${
      fieldErrors[field]
        ? "border-[#FFD166] focus-visible:border-[#FFD166]"
        : "border-[rgba(201,192,222,0.22)] hover:border-[rgba(255,209,102,0.62)] focus-visible:border-[#FFD166]"
    }`;

  const renderFieldError = (field: FieldName) => {
    const message = fieldErrors[field];

    if (!message) return null;

    return (
      <p
        id={`${field}-error`}
        role="alert"
        className="flex items-start gap-[9px] rounded-[10px] border border-[rgba(255,209,102,0.35)] bg-[rgba(245,166,35,0.08)] px-[12px] py-[10px] text-[0.82rem] leading-[1.5] text-[#F6E7C7] animate-in fade-in duration-200"
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
      className="px-[16px] py-[clamp(56px,8vw,96px)] sm:px-[24px]"
      aria-label="Registro de interés"
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] border border-[rgba(201,192,222,0.14)] bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.11),transparent_38%),linear-gradient(135deg,#1C0D42_0%,#160932_58%,#0F0626_100%)] px-[clamp(20px,5vw,64px)] py-[clamp(32px,6vw,68px)] shadow-[0_28px_80px_-38px_rgba(0,0,0,0.8)]">
        <div className="mx-auto max-w-[1080px]">
          <div className="grid grid-cols-2 items-start gap-[clamp(28px,5vw,64px)] max-[880px]:grid-cols-1">
            <div className="form-copy max-w-[480px] pt-[8px] max-[880px]:max-w-[680px]">
              <span className="mb-[18px] inline-flex items-center gap-[8px] rounded-full border border-[rgba(255,209,102,0.28)] bg-[rgba(245,166,35,0.08)] px-[12px] py-[7px] text-[0.73rem] font-[700] uppercase tracking-[0.12em] text-[#FFD166]">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#F5A623] shadow-[0_0_12px_rgba(245,166,35,0.75)]" />
                Únete a PubliGana
              </span>
              <h2 className="mb-[18px] max-w-[520px] font-[Fraunces] text-[clamp(2rem,4vw,3.15rem)] font-[600] leading-[1.08] tracking-[-0.025em] text-[#F6F1E7]">
                Sé de los primeros en PubliGana
              </h2>

              <p className="max-w-[460px] text-[clamp(0.96rem,1.4vw,1.05rem)] leading-[1.75] text-[#D0C8DF]">
                Estamos validando el modelo en Bogotá con negocios y usuarios
                reales. Déjanos tus datos y te avisamos en cuanto haya campañas
                disponibles en tu zona.
              </p>
              <p className="mt-[22px] flex items-center gap-[9px] text-[0.82rem] font-[600] text-[#C9C0DE]">
                <span aria-hidden="true" className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[rgba(59,130,246,0.4)] bg-[rgba(59,130,246,0.12)] text-[0.72rem] text-[#93C5FD]">
                  CO
                </span>
                Registro disponible para residentes en Colombia
              </p>
            </div>

            <div className="min-w-0 rounded-[22px] border border-[rgba(201,192,222,0.16)] bg-[rgba(15,6,38,0.48)] p-[clamp(18px,3vw,30px)] shadow-[0_20px_48px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
              <form
                id="leadForm"
                noValidate
                className="flex flex-col gap-[18px]"
                onSubmit={handleSubmit}
              >
                <div
                  className="flex gap-[8px] rounded-[14px] border border-[rgba(201,192,222,0.12)] bg-[rgba(255,255,255,0.035)] p-[5px]"
                  role="group"
                  aria-label="Tipo de usuario"
                >
                  <button
                    type="button"
                    disabled={isSubmitting}
                    aria-pressed={role === "usuario"}
                    onClick={() => handleRoleChange("usuario")}
                    className={`min-h-[44px] flex-1 cursor-pointer rounded-[10px] border px-[10px] py-[10px] text-center text-[0.88rem] font-[700] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD166] disabled:cursor-not-allowed disabled:opacity-60 ${
                      role === "usuario"
                        ? "border-[rgba(255,209,102,0.55)] bg-[linear-gradient(135deg,rgba(245,166,35,0.2),rgba(245,166,35,0.08))] text-[#FFD166] shadow-[0_4px_14px_rgba(245,166,35,0.08)]"
                        : "border-transparent bg-transparent text-[#C9C0DE] hover:border-[rgba(201,192,222,0.22)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F6F1E7]"
                    }`}
                  >
                    Quiero ganar
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    aria-pressed={role === "negocio"}
                    onClick={() => handleRoleChange("negocio")}
                    className={`min-h-[44px] flex-1 cursor-pointer rounded-[10px] border px-[10px] py-[10px] text-center text-[0.88rem] font-[700] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD166] disabled:cursor-not-allowed disabled:opacity-60 ${
                      role === "negocio"
                        ? "border-[rgba(255,209,102,0.55)] bg-[linear-gradient(135deg,rgba(245,166,35,0.2),rgba(245,166,35,0.08))] text-[#FFD166] shadow-[0_4px_14px_rgba(245,166,35,0.08)]"
                        : "border-transparent bg-transparent text-[#C9C0DE] hover:border-[rgba(201,192,222,0.22)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F6F1E7]"
                    }`}
                  >
                    Quiero anunciar
                  </button>
                </div>

                <div className="flex min-w-0 flex-col gap-[8px]">
                  <label
                    htmlFor="nombre"
                    className="text-[0.82rem] font-[700] tracking-[0.01em] text-[#E3DDED]"
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

                <div className="flex min-w-0 flex-col gap-[8px]">
                  <label
                    htmlFor="correo"
                    className="text-[0.82rem] font-[700] tracking-[0.01em] text-[#E3DDED]"
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

                <div className="flex min-w-0 flex-col gap-[8px]">
                  <label
                    htmlFor="departmentCode"
                    className="text-[0.82rem] font-[700] tracking-[0.01em] text-[#E3DDED]"
                  >
                    Departamento
                    <span className="ml-[4px] text-[#F5A623]">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="departmentCode"
                      name="departmentCode"
                      value={formData.departmentCode}
                      onChange={handleChange}
                      required
                      disabled={
                        municipalitiesLoading || departments.length === 0
                      }
                      aria-invalid={Boolean(fieldErrors.departmentCode)}
                      aria-describedby={
                        fieldErrors.departmentCode
                          ? "departmentCode-error"
                          : municipalitiesError
                            ? "municipalities-load-error"
                            : undefined
                      }
                      className={`${inputClass("departmentCode")} cursor-pointer appearance-none pr-[42px]`}
                    >
                      <option value="">
                        {municipalitiesLoading
                          ? "Cargando departamentos..."
                          : municipalitiesError
                            ? "No fue posible cargar el catálogo"
                            : "Selecciona un departamento"}
                      </option>
                      {departments.map((department) => (
                        <option key={department.code} value={department.code}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="pointer-events-none absolute right-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#C9C0DE]"
                    >
                      <path
                        d="m5 7.5 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {renderFieldError("departmentCode")}
                </div>

                <div className="flex min-w-0 flex-col gap-[8px]">
                  <label
                    htmlFor="municipalityCode"
                    className="text-[0.82rem] font-[700] tracking-[0.01em] text-[#E3DDED]"
                  >
                    Municipio, distrito o cabecera
                    <span className="ml-[4px] text-[#F5A623]">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="municipalityCode"
                      name="municipalityCode"
                      value={formData.municipalityCode}
                      onChange={handleChange}
                      required
                      disabled={
                        !formData.departmentCode ||
                        municipalitiesLoading ||
                        availableMunicipalities.length === 0
                      }
                      aria-invalid={Boolean(fieldErrors.municipalityCode)}
                      aria-describedby={
                        fieldErrors.municipalityCode
                          ? "municipalityCode-error"
                          : municipalitiesError
                            ? "municipalities-load-error"
                            : undefined
                      }
                      className={`${inputClass("municipalityCode")} cursor-pointer appearance-none pr-[42px]`}
                    >
                      <option value="">
                        {!formData.departmentCode
                          ? "Selecciona primero un departamento"
                          : "Selecciona tu municipio"}
                      </option>
                      {availableMunicipalities.map((municipality) => (
                        <option
                          key={municipality.code}
                          value={municipality.code}
                        >
                          {municipality.name} — {municipality.department}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="pointer-events-none absolute right-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#C9C0DE]"
                    >
                      <path
                        d="m5 7.5 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {renderFieldError("municipalityCode")}
                  {municipalitiesError && (
                    <p
                      id="municipalities-load-error"
                      role="alert"
                      className="text-[0.8rem] leading-[1.5] text-[#E4D8F5]"
                    >
                      {municipalitiesError}
                    </p>
                  )}
                </div>

                <div className="flex min-w-0 flex-col gap-[8px]">
                  <label
                    htmlFor="locality"
                    className="text-[0.82rem] font-[700] tracking-[0.01em] text-[#E3DDED]"
                  >
                    Ciudad, localidad, corregimiento o vereda
                    <span className="ml-[6px] font-[400] text-[#C9C0DE]">
                      (opcional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    maxLength={150}
                    aria-describedby="locality-hint"
                    className={inputClass("locality")}
                    placeholder="Escribe un nombre, si deseas"
                  />
                  <p
                    id="locality-hint"
                    className="text-[0.8rem] leading-[1.5] text-[#C9C0DE]"
                  >
                    Es un dato complementario y no reemplaza el municipio o
                    distrito seleccionado.
                  </p>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <label className="flex cursor-pointer items-start gap-[12px] rounded-[12px] border border-[rgba(201,192,222,0.12)] bg-[rgba(255,255,255,0.025)] p-[14px] text-[0.84rem] leading-[1.6] text-[#D0C8DF] transition-colors hover:border-[rgba(255,209,102,0.3)]">
                    <input
                      type="checkbox"
                      checked={residencyConfirmed}
                      onChange={(event) => {
                        setResidencyConfirmed(event.target.checked);
                        setFieldErrors((prev) => ({
                          ...prev,
                          residencyConfirmed: undefined,
                        }));
                      }}
                      aria-invalid={Boolean(fieldErrors.residencyConfirmed)}
                      aria-describedby={
                        fieldErrors.residencyConfirmed
                          ? "residencyConfirmed-error"
                          : undefined
                      }
                      className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#F5A623] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD166]"
                    />
                    <span>
                      Declaro que resido actualmente en Colombia. Esta
                      confirmación se refiere a mi residencia, no a mi
                      nacionalidad.
                      <span className="ml-[4px] text-[#F5A623]">*</span>
                    </span>
                  </label>
                  {renderFieldError("residencyConfirmed")}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-[2px] inline-flex min-h-[52px] w-full items-center justify-center gap-[9px] rounded-[12px] border border-[rgba(255,209,102,0.8)] bg-[linear-gradient(135deg,#FFD166_0%,#F5A623_58%,#E89512_100%)] px-[24px] py-[14px] text-[0.96rem] font-[800] tracking-[0.005em] text-[#0F0626] shadow-[0_10px_26px_-12px_rgba(245,166,35,0.8)] transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105 hover:shadow-[0_14px_34px_-12px_rgba(245,166,35,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD166] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
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