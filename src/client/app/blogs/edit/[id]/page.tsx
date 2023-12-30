'use client'

import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js'
import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { getAllCategories, getBlogById } from '@/lib/helpers'
import { BlogType } from '@/lib/types'

const EditBlog = async ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession()
  const blog = await getBlogById(params.id)
  const categories = await getAllCategories()

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const headingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    getBlogById(session?.user.id ?? '')
      .then((data: BlogType) => {
        const contentBlocks = convertFromHTML(data.description)
        const contentState = ContentState.createFromBlockArray(
          contentBlocks.contentBlocks
        )
        const initialState = EditorState.createWithContent(contentState)
        setEditorState(initialState)
        if (headingRef && headingRef.current)
          headingRef.current.innerText = data.title
      })
      .catch((err) => console.log(err))
  }, [])

  const handlePost = async (data: any) => {
    try {
      toast.loading('Sending your post...', { id: 'postData' })

      await fetch(`${process.env.API_URL}/api/blogs`, {
        method: 'PUT',
        cache: 'no-store',
      })

      toast.success('Post sent', { id: 'postData' })
    } catch (err) {
      toast.error('Error sending post', { id: 'postData' })
    }
  }

  const convertEditorToHTML = () => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  const handleEditorStateChange = (e: any) => {
    setEditorState(e)
  }

  return (
    <section className="w-full">
      <Toaster position="top-right" />
      <div className="flex justify-between p-4 items-center">
        <div className="w-24">
          <span className="font-extrabold mx-3">Author:</span>
          <span className="uppercase font-semibold">{session?.user?.name}</span>
        </div>
        <button
          onClick={handlePost}
          className="bg-violet-600 text-gray-100 px-6 focus:ring-violet-950 py-3 rounded-xl font-semibold shadow-xl hover:bg-violet-700"
        >
          Publish
        </button>
      </div>
      <h1
        ref={headingRef}
        contentEditable={true}
        className="outline-none border-none font-serif mx-auto p-4 text-2xl text-center font-semibold w-full h-28 focus:border-none"
      >
        Enter title
      </h1>
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

export default EditBlog
