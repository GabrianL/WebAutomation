
import { CommonPage, LoginPage } from '../support/pages';
/// <reference types="cypress" />
context('Login', () => {
    beforeEach(() => {
      cy.visit('https://www.saucedemo.com')
    })
    it.only('cannot login due to locked user', () => {
        LoginPage.UserName()
          .type('locked_out_user')
          .should('have.value', 'locked_out_user')
  
        LoginPage.Password()
          .type('secret_sauce')
          .should('have.value', 'secret_sauce')
  
        LoginPage.LoginButton().click()
  
        LoginPage.ErrorMessage()
          .should('have.text', 'Epic sadface: Sorry, this user has been locked out.')
  
      })
 })
