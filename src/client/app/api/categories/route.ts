import { generateErrorMessage, generateSuccessMessage } from "@/lib/helpers"

export const GET = async () => {
	try {
		const response = await fetch(
			`${process.env.API_URL}/api/categories`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (response.ok) {
			const categories = await response.json()
			return generateSuccessMessage(categories, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage(error, 500)
	}
}

export const POST = async (req: Request) => {
	try {
		const postForm = await req.json();
		const response = await fetch(
			`${process.env.API_URL}/api/categories`,
			{
				method: 'POST',
				body: JSON.stringify(postForm),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (response.ok) {
			const category = await response.json()
			return generateSuccessMessage(category, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage(error, 500)
	}
}
