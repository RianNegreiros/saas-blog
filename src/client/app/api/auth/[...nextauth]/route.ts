import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: AuthOptions = {
	providers: [
		GithubProvider({ clientId: "", clientSecret: "" }),
		GoogleProvider({ clientId: "", clientSecret: "" }),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { type: "text" },
				password: { type: "password" },
			},
			authorize: async (credentials, req) => {
				if (!credentials || !credentials.email || !credentials.password) {
					return null
				}

				const response = await fetch(`${process.env.API_URL}/register`, {
					method: "POST",
					body: JSON.stringify(credentials),
					headers: {
						"Content-Type": "application/json",
					},
				})

				if (response.ok) {
					const user = await response.json()
					return user
				}
				return null
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
