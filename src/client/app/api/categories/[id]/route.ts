import { generateErrorMessage, generateSuccessMessage } from "@/lib/helpers"

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
	try {
		const id = params.id
		const response = await fetch(
			`${process.env.API_URL}/api/categories/${id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)

		if (response.ok) {
			const user = await response.json()
			return generateSuccessMessage({ ...user }, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage({ error }, 500)
	}
}
