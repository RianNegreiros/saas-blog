import { generateSuccessMessage, generateErrorMessage } from "@/lib/helpers"

export const GET = async (req: Request) => {
	const searchedTitle = new URL(req.url).searchParams.get("title")
	try {

		const response = await fetch(`${process.env.API_URL}/api/blogs/search?title=${searchedTitle}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			const blog = await response.json()
			return generateSuccessMessage({ ...blog }, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage({ error }, 500)
	}
}
