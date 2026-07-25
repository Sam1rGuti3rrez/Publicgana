import API_URL from "./api";

export async function registrarLead(lead) {
	const response = await fetch(`${API_URL}/api/leads`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(lead),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => null);

		throw new Error(
			error?.message || "No fue posible registrar el interés."
		);
	}

	return response.json();
}