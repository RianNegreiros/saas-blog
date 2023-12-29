export type BlogType = {
	id: string
	title: string
	description: string
	imageUrl: string
	userId: string
	createdAt: string
	updatedAt: string
	categoryId: string
	isProfile: boolean
}

export type UserType = {
	id: string
	name: string
	email: string
	blogs: BlogType[]
	count: { blogs: number }
}
