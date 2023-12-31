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
import { getBlogById, updateBlog } from '@/lib/helpers'
import { BlogType } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

const EditBlog = async ({ params }: { params: { id: string } }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setIsLoading(true)
    toast.loading('Updating blog details', { id: 'loading' })
    getBlogById(params.id)
      .then((data: BlogType) => {
        const contentBlocks = convertFromHTML(data.description)
        const contentState = ContentState.createFromBlockArray(
          contentBlocks.contentBlocks
        )
        const initialState = EditorState.createWithContent(contentState)
        setEditorState(initialState)
        if (headingRef && headingRef.current)
          headingRef.current.innerText = data.title
        setIsLoading(false)
      })
      .catch((err) => {
        toast.error('Error updating blog', { id: 'loading' })
      })
      .finally(() => {
        setIsLoading(false)
        toast.success('Blog updated', { id: 'loading' })
      })
  }, [params.id])

  const handlePost = async (data: any) => {
    const postData = {
      title: headingRef.current?.innerText,
      description: convertEditorToHTML(),
    }
    try {
      toast.loading('Updating your post...', { id: 'postUpdated' })

      await updateBlog(params.id, postData)

      toast.success('Post updated', { id: 'postUpdated' })
    } catch (err) {
      toast.error('Error updating post', { id: 'postUpdated' })
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
      {isLoading && (
        <p>
          <Skeleton className="w-[300px] h-[20px] rounded-lg mx-auto" />
        </p>
      )}
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
