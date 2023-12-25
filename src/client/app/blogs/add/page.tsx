'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const AddBlog = () => {
  const { data: session } = useSession()
  const [imageUrl, setImageUrl] = useState('')

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    const file = e.target.files[0]
    setImageUrl(URL.createObjectURL(file))
  }

  const categories = [
    {
      id: '1',
      name: 'Technology',
    },
  ]

  return (
    <section className="w-full">
      <div className="flex justify-between p-4 items-center">
        <div className="w-24">
          <span className="font-extrabold mx-3">Author:</span>
          <span className="uppercase font-semibold">{session?.user?.name}</span>
        </div>
        <button className="bg-violet-600 text-gray-100 px-6 focus:ring-violet-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-violet-700">
          Publish
        </button>
      </div>
      {imageUrl && (
        <Image
          className="mx-auto my-20 rounded-lg shadow-xl"
          src={imageUrl}
          alt="NewPost"
          width={800}
          height={400}
        />
      )}
      <h1
        contentEditable={true}
        className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none"
      >
        Enter title
      </h1>
      <div className="w-full flex my-5">
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold"
        />
      </div>
      <div className="w-full flex my-5">
        <select
          name="category"
          className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold"
        >
          {categories.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      <Editor
        editorStyle={{
          width: '50vh',
          height: 'auto',
          border: '1px solid #000',
          padding: 10,
        }}
      />
    </section>
  )
}

export default AddBlog
