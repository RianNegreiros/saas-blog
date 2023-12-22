import { generateErrorMessage, generateSuccessMessage } from '@/lib/helpers'

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const id = params.id
		const response = await fetch(`${process.env.API_URL}/api/blogs/${id}`, {
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

export const PUT = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const id = params.id
		const { title, description } = await req.json()
		const response = await fetch(`${process.env.API_URL}/api/blogs/${id}`, {
			method: 'GET',
			body: JSON.stringify({
				title,
				description,
			}),
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
