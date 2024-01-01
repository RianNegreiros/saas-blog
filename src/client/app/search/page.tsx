'use client'

import { BlogType } from '@/lib/types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaSearch } from 'react-icons/fa'
import BlogItem from '../components/BlogItem'

const Search = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const { handleSubmit, register } = useForm()
  const handleSearch = async ({ search }: { search: string }) => {
    let str = search
    if (search.includes(' ')) {
      str = search.split(' ').join('%20')
    }

    toast.loading('Searching', { id: 'search' })

    try {
      const res = await fetch(
        `${process.env.API_URL}/blogs/search?title=${str}`,
        {
          cache: 'no-store',
        }
      )
      const data = await res.json()
      setBlogs(data)
      toast.success('Search successful')
    } catch (err) {
      toast.error('Search failed', { id: 'search' })
    }
  }
  return (
    <section className="w-full h-full">
      <h2 className="text-3xl text-center font-bold font-serif">
        Search Blogs
      </h2>
      <div className="md:w-2/4 xs:w-3/4 mx-auto flex items-center justify-between bg-slate-100 my-4 px-6 py-4 rounded-xl text-gray-900 font-semibold">
        <input
          type="text"
          id=""
          className="bg-transparent border-none outline-none p-1 w-full"
          {...register('search', { required: true })}
        />
        <FaSearch
          //@ts-ignore
          onClick={handleSubmit(handleSearch)}
          size={40}
          className="hover:bg-slate-300 p-2 rounded-full cursor-pointer"
        />
      </div>
      <div className="flex flex-wrap">
        {blogs.map((blog) => (
          <BlogItem {...blog} key={blog.id} />
        ))}
      </div>
    </section>
  )
}

export default Search
