import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Testing my front-end',
  author: 'Frances van Rooyen',
  url: 'https:myblog.com',
  likes: 88,
  user: {
    username: 'Redd',
    name: 'Frances',
    id: '6359186946a2a112466e73de'
  }
}

const token = {
  name: 'Van',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjYzNjdlN2Y3OTE1MmI3MjcwYTJkZTM4OCIsImlhdCI6MTY2ODM1NDc4MH0.abyJTPbrQLU2j7yqIRtgS6zBPrytDmEhc4aGygZEZAU',
  username: 'test'
}

describe('Blog component', () => {
  test('renders blog title and author, but not likes or url', () => {
    render(<Blog blog={blog} user={token}/>)

    screen.debug()
    const titleElement = screen.getByText('Testing my front-end')
    const authorElement = screen.getByText('by Frances van Rooyen')
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
    const urlElement = screen.queryByText('https:myblog.com')
    expect(urlElement).not.toBeVisible()
    const likeElement = screen.queryByText('Likes: 88')
    expect(likeElement).not.toBeVisible()
  })

  test('clicking the show button reveals additional info', async () => {
    render(
      <Blog blog={blog} user = {token}/>
    )
    const userClick = userEvent.setup()
    const button = screen.getByText('View')
    await userClick.click(button)

    const urlElement = screen.queryByText('https:myblog.com')
    expect(urlElement).toBeVisible()
    const likeElement = screen.queryByText('Likes: 88')
    expect(likeElement).toBeVisible()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const likemockHandler = jest.fn()

    render(
      <Blog blog={blog} user ={token} likeBlog={likemockHandler} />
    )

    const userClick = userEvent.setup()
    const viewButton = screen.getByText('View')
    await userClick.click(viewButton)

    const likeButton = screen.getByText('Like')
    await userClick.click(likeButton)
    await userClick.click(likeButton)

    expect(likemockHandler.mock.calls).toHaveLength(2) //adjust to call twice
  })
})