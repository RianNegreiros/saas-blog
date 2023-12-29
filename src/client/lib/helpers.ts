import { NextResponse } from 'next/server'

const apiUrl = 'http://localhost:3000/api'

export const generateSuccessMessage = (data: any, status: number) => {
	return NextResponse.json(
		{ message: 'Success', ...data },
		{ status, statusText: 'OK' }
	)
}

export const generateErrorMessage = (data: any, status: number) => {
	return NextResponse.json(
		{ message: 'Error', ...data },
		{ status, statusText: 'ERROR' }
	)
}

export const getAllBlogs = async (count?: number) => {
	const res = await fetch(`${apiUrl}/blogs`, {
		cache: 'no-store',
	})
	const data = await res.json()
	const arrayData = Array.of(data)
	if (count) {
		return arrayData.slice(0, 6)
	}
	return arrayData
}

export const getBlogById = async (id: string) => {
	const res = await fetch(`${apiUrl}/blogs/${id}`)
	const data = await res.json()
	return data.blog
}
