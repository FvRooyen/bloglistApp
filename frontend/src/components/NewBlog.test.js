/* eslint-disable no-unused-vars */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Newblog from './Newblog'
import Togglable from './Togglable'
import userEvent from '@testing-library/user-event'

let container

beforeEach(() => {
  container = render(
    <Togglable buttonLabel="add blog">
      <div className="testDiv" >
          togglable content
      </div>
    </Togglable>
  ).container
})

test('<NewBlog /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const button = screen.getByText('add blog')
  await user.click(button)

  const createBlog = jest.fn()

  render(<Newblog createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  await userEvent.type(titleInput,'testing a form...')
  await userEvent.type(authorInput, 'Jan Nel', )
  await userEvent.type( urlInput, 'http:jan.com')

  const userClick = userEvent.setup()
  const sendButton = screen.getByText('Save')
  await userClick.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({ 'author': 'Jan Nel', 'title': 'testing a form...', 'url': 'http:jan.com' })
})
