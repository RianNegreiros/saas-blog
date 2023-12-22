import { NextResponse } from 'next/server'

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
	const res = await fetch("http://localhost:3000/api/blogs", { cache: "no-store" })
	const data = await res.json()
	const arrayData = Array.of(data)
	if (count) {
		return arrayData.slice(0, 6);
	}
	return arrayData;
}
