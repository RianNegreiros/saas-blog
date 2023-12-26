'use client'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { useForm } from 'react-hook-form'
import draftJsToHtml from 'draftjs-to-html'
import toast, { Toaster } from 'react-hot-toast'

const AddBlog = () => {
  const { data: session } = useSession()

  const [imageUrl, setImageUrl] = useState('')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const { handleSubmit, register } = useForm()

  const handlePost = async (data: any) => {
    const formData = new FormData()
    const postData = JSON.stringify({
      title: headingRef.current?.innerText,
      description: convertEditorToHTML(),
      userId: session?.user.id,
      categoryId: data.category
    })
    formData.append('postData', postData)
    formData.append("image", data.image[0])
    try {
      toast.loading("Sending your post...", { id: "postData" })

      await fetch(`${process.env.API_URL}/api/blogs`, { method: "POST", body: formData, cache: "no-store" })

      toast.success("Post sent", { id: "postData" })
    } catch (err) {
      toast.error("Error sending post", { id: "postData" })
    }
  }

  const convertEditorToHTML = () => {
    return draftJsToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  const handleEditorStateChange = (e: any) => {
    setEditorState(e)
  }

  const categories = [
    {
      id: '1',
      name: 'Technology',
    },
  ]

  return (
    <section className="w-full">
      <Toaster position='top-right' />
      <div className="flex justify-between p-4 items-center">
        <div className="w-24">
          <span className="font-extrabold mx-3">Author:</span>
          <span className="uppercase font-semibold">{session?.user?.name}</span>
        </div>
        <button
          onClick={handleSubmit(handlePost)}
          className="bg-violet-600 text-gray-100 px-6 focus:ring-violet-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-violet-700"
        >
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
        ref={headingRef}
        contentEditable={true}
        className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none"
      >
        Enter title
      </h1>
      <div className="w-full flex my-5">
        <input
          type="file"
          className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold"
          {...register("image", {
            required: true,
            onChange(event) {
              setImageUrl(URL.createObjectURL(event.target.files[0]))
            }
          })}
        />
      </div>
      <div className="w-full flex my-5">
        <select
          className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold"
          {...register("category", { required: true })}
        >
          {categories.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorStateChange}
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
