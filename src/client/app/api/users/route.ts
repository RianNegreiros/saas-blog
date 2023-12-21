import { generateErrorMessage, generateSuccessMessage } from "@/lib/helpers"

export const GET = async () => {
	try {
		const response = await fetch(
			`${process.env.API_URL}/api/users`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (response.ok) {
			const users = await response.json()
			return generateSuccessMessage(users, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage(error, 500)
	}
}
