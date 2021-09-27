/// <reference types="cypress"/>

beforeEach(() => {
  cy.visit('/')
})

describe('Display test', () => {
  // dispaly check
  it('Check page title display', () => {
    cy.get('.prefectures-title').should('be.visible').should('contain', '都道府県')
  })
  it('Check available button', () => {
    cy.get('.filter-items').should('be.visible').should
    expect(47).to.equal(47)
  })
  it('Check chart display', () => {
    cy.get('#chart').should('be.visible')
  })
  it('Check chart title', () => {
    cy.contains('市町村別の人口推移を表したグラフ').should('be.visible')
  })
  it('Check yaxis title', () => {
    cy.contains('人口数').should('be.visible')
  })
  it('Check xaxis title', () => {
    cy.get('.apexcharts-xaxis-title>text').contains('年度')
  })
  it('Check chart tool', () => {
    cy.get('.apexcharts-toolbar').should('be.visible')
  })
  it('Check first checkbox display', () => {
    cy.get('input[type=checkbox]').first('input').should('be.checked')
    cy.get('input[type=checkbox]').then((data) =>
      data.each((index, element) => (index ? expect(element.checked).to.equal(false) : ''))
    )
    cy.get('input[type=checkbox]').closest('label').first().should('have.text', '北海道')
  })
})
