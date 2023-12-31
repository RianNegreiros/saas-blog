import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BlogType } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Props = BlogType

function getTextFromHtml(html: string) {
  const elm = document.createElement('span')
  elm.innerHTML = html
  return elm.innerText.slice(0, 300)
}

const deleteBlog = async (id: string) => {
  await fetch(`${process.env.API_URL}/blogs/${id}`, {
    cache: 'no-store',
    method: 'DELETE',
  })
}

const BlogItem = (props: Props) => {
  const handleDelete = async () => {
    try {
      toast.loading('Deleting Blog', { id: 'delete' })
      await deleteBlog(props.id)
      toast.success('Deleted Blog', { id: 'delete' })
    } catch (err) {
      toast.error('Error deleting blog')
    }
  }
  return (
    <Card className="hover:border-slate-950 duration-500 flex flex-col w-[400px] h-[550px] mx-4 my-2 rounded-lg">
      <CardHeader>
        <Image
          width={400}
          height={100}
          className="h-48 rounded-sm"
          alt={props.title}
          src={
            props.imageUrl ??
            'https://images.unsplash.com/photo-1542435503-956c469947f6'
          }
        />
      </CardHeader>
      <CardTitle className="p-3">{props.title}</CardTitle>
      <CardContent className="w-full text-slate-900">
        <p className="tracking-wide w-full px-2 py-1 text-left">
          {getTextFromHtml(props.description)}
        </p>
      </CardContent>
      <CardFooter className="w-full h-full p-3 flex justtify-between items-center">
        <Link
          href={`/blogs/view/${props.id}`}
          className="mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-white duration-500"
        >
          View More
        </Link>
        <Link
          href={`/blogs/edit/${props.id}`}
          className="mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-white duration-500"
        >
          Edit Blog
        </Link>
        {props.isProfile && (
          <button
            onClick={handleDelete}
            className="mt-auto border-[1px] p-3 rounded-lg hover:bg-violet-600 hover:text-white duration-500"
          >
            Delete Blog
          </button>
        )}
      </CardFooter>
    </Card>
  )
}

export default BlogItem
