import { generateErrorMessage, generateSuccessMessage } from '@/lib/helpers'
import { UploadApiResponse, v2 } from 'cloudinary'

async function uploadImage(file: Blob) {
	return new Promise<UploadApiResponse>(async (resolve, reject) => {
		const buffer = Buffer.from(await file.arrayBuffer())
		v2.uploader
			.upload_stream(
				{ resource_type: 'auto', folder: 'saasblog' },
				(err, result) => {
					if (err) {
						console.log(err)
						return reject(err)
					} else if (result) {
						return resolve(result)
					}
				}
			)
			.end(buffer)
	})
}

export const GET = async () => {
	try {
		const response = await fetch(`${process.env.API_URL}/api/blogs`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})

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
	v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		api_key: process.env.CLOUDINARY_API_KEY,
	})

	try {
		const formData = await req.formData()
		const { title, description, userID, categoryID } = JSON.parse(
			formData.get('postData') as string
		)
		const file = formData.get('image') as Blob | null
		let uploadedFile: UploadApiResponse | null = null
		if (file) {
			uploadedFile = await uploadImage(file)
		} else {
			uploadedFile = null
		}

		console.log(file?.text)
		const response = await fetch(`${process.env.API_URL}/api/blogs`, {
			method: 'POST',
			body: JSON.stringify({
				title,
				description,
				userID,
				categoryID,
				imageUrl: uploadedFile?.url ?? null,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (response.ok) {
			const blog = await response.json()
			return generateSuccessMessage(blog, 200)
		}
		return null
	} catch (error) {
		return generateErrorMessage(error, 500)
	}
}
