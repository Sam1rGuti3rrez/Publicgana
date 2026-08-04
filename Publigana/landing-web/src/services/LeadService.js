import API_URL from "./api";

export async function registrarLead(lead) {
	if (!API_URL) {
		throw new Error(
			"La URL del API no está configurada. Contacta al administrador."
		);
	}

	let response;
	try {
		response = await fetch(`${API_URL}/api/leads`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(lead),
		});
	} catch {
		// Error de red o CORS — fetch lanza TypeError en estos casos
		throw new Error(
			"No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde."
		);
	}

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		throw new Error(
			errorBody?.message ||
				`Error ${response.status}: No fue posible registrar el interés.`
		);
	}

	return response.json();
}