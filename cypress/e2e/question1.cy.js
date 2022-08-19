
import { CommonPage, LoginPage } from '../support/pages';
/// <reference types="cypress" />
context('Login', () => {
    beforeEach(() => {
        cy.visit('https://www.saucedemo.com')
    })
    it('Question 1', () => {
        //Login User 
        LoginPage.UserName()
            .type('standard_user')
            .should('have.value', 'standard_user')

        LoginPage.Password()
            .type('secret_sauce')
            .should('have.value', 'secret_sauce')

        LoginPage.LoginButton().click()

        CommonPage.MainBurgerButton()
            .invoke('text')
            .should('match', /Menu/i)
        // Add items in the card    
        let inCart = 0;
        CommonPage.InventoryItems()
            .each(($el, index, $list) => {
                if (index % 2 == 0) {
                    cy.wrap($el).find('.btn_primary')
                        .should('be.visible')
                        .click({ force: true })
                        .should('have.class', 'btn_secondary')
                    inCart++;
                }
            })
            .then(() => {
                CommonPage.ShoppingCartBadge()
                    .should('have.text', '' + inCart)
            })

        cy.window('cart-contents').should('eq', '[4,1,2]')

    })

    // Go to cart remove seccond item 
    it('remove product', () => {
        cy.visit('cart.html')
        let RemoveFirstItem = ($cart, $count) => {
            CommonPage.CartListItems()
                .first()
                .find('.btn_secondary')
                .click()

            cy.getSessionStorage('cart-contents').should('eq', $cart)

            if ($count) {
                CommonPage.ShoppingCartBadge()
                    .should('have.text', $count)
            } else {
                CommonPage.ShoppingCartBadge()
                    .should('not.exist')
            }
        }
        RemoveSecondItem('[1,2]', '2');

        RemoveSecondItem('[2]', '1');

        RemoveSecondItem('[]', null);

    })
    // Proceed the checkout, 
    //Fill the details and continue
    //Verify the payment confirmation 
    //Verify the price
    // Click Finish
    // Go to the thank you and verify the massage and the image are pressent 
    it('buy product', () => {
        let firstName = 'Liviu'
        let lastname = 'Gabrian'
        let psc = '68201'
        let CartButton = () => {
            cy.get('.cart_button')
                .click();
        }

        cy.get('.checkout_button')
            .click();

        cy.get('#first-name')
            .type(firstName)
            .should('have.value', firstName)

        cy.get('#last-name')
            .type(lastname)
            .should('have.value', lastname)

        cy.get('#postal-code')
            .type(psc)
            .should('have.value', psc)

        CartButton()

        cy.get('.summary_subtotal_label')
            .should('have.text', 'Item total: $53.97')

        cy.get('.summary_tax_label')
            .should('have.text', 'Tax: $4.32')

        cy.get('.summary_total_label')
            .should('have.text', 'Total: $58.29')

        CartButton()

        cy.get('.subheader')
            .should('have.text', 'Finish')

        cy.get('.complete-header')
            .should('have.text', 'THANK YOU FOR YOUR ORDER')


        cy.get('.pony-express')
            .find('img')
            .should('include', 'pony-express.46394a5d.png')

    })

})



