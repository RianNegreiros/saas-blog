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
		next: { revalidate: 60 },
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

export const getUserById = async (id: string) => {
	const res = await fetch(`${apiUrl}/users/${id}`, {
		next: { revalidate: 100 },
	})
	const data = await res.json()
	return data
}

export const getAllCategories = async () => {
	const res = await fetch(`${apiUrl}/categories`, {
		cache: 'no-store',
	})
	const data = await res.json()
	return Array.of(data)
}

export const updateBlog = async (id: string, postData: any) => {
	const res = await fetch(`${process.env.API_URL}/blogs${id}`, {
		cache: 'no-store',
		method: 'PUT',
		body: JSON.stringify({ ...postData }),
	})
	const data = await res.json()
	return data.blog
}
