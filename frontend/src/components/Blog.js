
import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [view, setView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: view ? 'none' : '' }
  const showWhenVisible = { display: view ? '' : 'none' }

  const deleteButton = () => (
    <button
      onClick={() => {deleteBlog(blog)}}>Delete blog
    </button>
  )

  return (
    <div style={blogStyle} className='bloglist'>
      <i>{blog.title}</i> by {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={() => {setView(true)}}>View</button>
      </div>
      <div style={showWhenVisible}>
        <button onClick={() => {setView(false)}}>hide</button>
        <p>{blog.url}</p>
        <p> Likes: {blog.likes}
          <button onClick={likeBlog}> Like</button> </p>
        <p> Added by: {blog.user.username}</p>
        {blog.user.username === user.username && deleteButton()}
      </div>
    </div>
  )
}

export default Blog