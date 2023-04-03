import { useState } from 'react'

const Newblog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange=(event) => setTitle(event.target.value)
  const handleAuthorChange=(event) => setAuthor(event.target.value)
  const handleUrlChange=( event ) => setUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      url: url,
      author: author,
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }


  return (
    <div>
      <h2>Create new blog entry</h2>

      <form onSubmit={addBlog}>
        <div>title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={handleTitleChange}
            placeholder='title'
            id='title'/>
        </div>
        <div>author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={handleAuthorChange}
            placeholder='author'
            id='author' />
        </div>
        <div>url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={handleUrlChange}
            placeholder='url'
            id='url'/>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )

}

export default Newblog