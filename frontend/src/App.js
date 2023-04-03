import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Newblog from './components/Newblog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(
    { message: null, type: null })


  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'Invalid credentials' , type: 1 })
      console.log(notification)
      setTimeout(() => {
        setNotification({ message:null,type:null })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {

    try {await blogService.create(blogObject)

      blogFormRef.current.toggleVisibility()
      setNotification({ message: `${blogObject.title} by ${blogObject.author} added!` , type: 0 })
      setTimeout(() => {
        setNotification({ message:null,type:null })
      }, 5000)
    } catch(exception){
      setNotification({ message: exception.response.data.error , type: 1 })
      console.log(notification)
      setTimeout(() => {
        setNotification({ message:null,type:null })
      }, 5000)
    }
  }

  const loginForm = () => (
    <><h2>Login to Application</h2>
      <form onSubmit={handleLogin}>
        <div>
         username
          <input
            type="text"
            id='username'
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
         password
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button id="login-button" type="submit">login</button>
      </form></>
  )

  const likeBlog = async (id) => {
    const blog = await blogs.find(n => n.id === id)

    const newLikes = blog.likes + 1
    console.log(newLikes)

    const updatedBlog = { ...blog, likes: newLikes }

    const trimmed_id = id.trim()

    try {await blogService.update(trimmed_id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
      setNotification({ message: `You liked ${updatedBlog.title} by ${updatedBlog.author}!` , type: 0 })
      setTimeout(() => {
        setNotification({ message:null,type:null })
      }, 5000)
    } catch(exception){
      setNotification({ message: exception.response.data.error , type: 1 })
      console.log(notification)
      setTimeout(() => {
        setNotification({ message:null,type:null })
      }, 5000)
    }
  }

  const deleteBlog = async (blogToDelete) => {

    console.log(blogToDelete)

    if (window.confirm(`Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      try {await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
        setNotification({ message: `Blog titled: ${blogToDelete.title} deleted` , type: 0 })
        setTimeout(() => {
          setNotification({ message:null,type:null })
        }, 5000)
      } catch(exception){
        setNotification({ message: exception.response.data.error , type: 1 })
        console.log(notification)
        setTimeout(() => {
          setNotification({ message:null,type:null })
        }, 5000)
      }
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedNoteappUser')

    setUser(null)
    setUsername('')
    setPassword('')
  }

  return (
    <><div>
      <Notification notification={notification} />
      {user === null ?
        <div> {loginForm()} </div>:
        <div>
          <p><b>{user.name}</b> logged in
            <button onClick={logOut}>Log out</button></p>

          <Togglable buttonLabel = 'add blog' ref = {blogFormRef}>
            <Newblog createBlog={addBlog} />
          </Togglable>
          <h2>Blogs</h2>
          {blogs
            .sort((a,b) => b.likes-a.likes)
            .map(blog =>
              <Blog key={blog.id}
                blog={blog}
                user={user}
                likeBlog = { () => likeBlog (blog.id)}
                deleteBlog = {deleteBlog}/>
            )}
        </div>}
    </div>
    </>
  )
}

export default App
