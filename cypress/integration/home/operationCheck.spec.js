/// <reference types="cypress"/>

beforeEach(() => {
  cy.visit('/')
})

describe('Operation check', () => {
  let randomNum = () => Math.floor(Math.random() * 47 + 1)
  // operation check
  it('Check click into checkbox first', () => {
    cy.get('input[type=checkbox]')
      .first('input')
      .click()
      .then((element) => {
        expect(element[0].checked).to.equal(false)
      })
    cy.get('.apexcharts-legend').then((element) => {
      console.log(element.children())
      expect(element.children().length).to.equal(0)
    })
  })
  it('Check click random  checkbox', () => {
    const randomCheckboxWillClick = randomNum()
    for (let i = 0; i < randomCheckboxWillClick; i++) {
      const checkboxID = randomNum()
      cy.clickCheckbox(checkboxID)
    }
  })
})
