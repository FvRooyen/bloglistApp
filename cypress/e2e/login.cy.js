describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    const altUser = {
      name: 'Frances',
      username: 'redd',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', altUser)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function () {
    cy.contains('Login to Application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with incorrect credentials', function () {
      cy.get('#username').type('nonexistant')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'Invalid credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A new blog can be created', function () {
      cy.contains('add blog').click()
      cy.get('#title').type('Testing bloglist with cypress')
      cy.get('#author').type('Jan Smuts')
      cy.get('#url').type('www.janatwar.com')
      cy.contains('Save').click()
      cy.get('.notification')
        .should('contain', 'Testing bloglist with cypress by Jan Smuts added!')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title:'Testing bloglist with cypress',
          author:'Jan Smuts',
          url: 'www.janatwar.com',
          likes: 1
        })
      })

      it('likes can be increased', function () {
        cy.contains('View').click()
        cy.contains('Like').click()
        cy.contains('You liked Testing bloglist with cypress by Jan Smuts!')
        cy.contains('Likes: 2')

        cy.contains('Like').click()
        cy.contains('You liked Testing bloglist with cypress by Jan Smuts!')
        cy.contains('Likes: 3')
      })

      it('it can be deleted by the user that created it', function () {
        cy.contains('View').click()
        cy.contains('Delete').click()
        cy.on('window:confirm', () => true)
        cy.contains('Blog titled: Testing bloglist with cypress deleted')
        cy.get('html').should('not.contain', 'www.janatwar.com')
      })

      /it('it cannot be deleted by other users', function() {
        cy.contains('Log out').click()
        cy.login({ username: 'redd', password: 'password' })
        cy.contains('View').click()
        cy.get('html').should('not.contain', 'Delete')
      })
    })
    describe ('and many blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({
          title:'Testing bloglist with cypress',
          author:'Jan Smuts',
          url: 'www.janatwar.com',
          likes: 5
        })
        cy.createBlog({
          title:'How to use Lodash',
          author:'Piet Pompies',
          url: 'www.how2java.com',
          likes: 7
        })
        cy.createBlog({
          title:'A day in the life',
          author:'Jan Smuts',
          url: 'www.aday.co.za',
          likes: 8
        })
      })
      it('orders the blogs according to likes', function() {
        cy.get('.bloglist').eq(0).should('contain', 'A day in the life by Jan Smuts')
        cy.get('.bloglist').eq(1).should('contain', 'How to use Lodash by Piet Pompies')
        cy.get('.bloglist').eq(2).should('contain', 'Testing bloglist with cypress')

        cy.contains('How to use Lodash by Piet Pompies')
          .contains('View')
          .click()

        cy.contains('How to use Lodash by Piet Pompies')
          .contains('Like')
          .click()
        cy.wait(6000)
        cy.contains('How to use Lodash by Piet Pompies')
          .contains('Like')
          .click()
        cy.wait(6000)

        cy.get('.bloglist').eq(0).should('contain', 'How to use Lodash by Piet Pompies')
        cy.get('.bloglist').eq(1).should('contain', 'A day in the life by Jan Smuts')
        cy.get('.bloglist').eq(2).should('contain', 'Testing bloglist with cypress')
      })
    })
  })

})
