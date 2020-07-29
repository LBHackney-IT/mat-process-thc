Feature: Accessibility

  As a user with access needs
  I want to have my needs met
  So that I can use the service

  Scenario: Index page is accessible
    When I visit the index page
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Loading page is accessible
    When I start the process
    And I wait for the data to be fetched
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Sections page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /sections for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Verify tenant details page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /verify for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Outside page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /outside for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Start page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /start for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: About visit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /about-visit for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Present for check page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /present-for-check for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: ID page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /id/resident-ref for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Residency page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /residency/resident-ref for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Tenant photo page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /tenant-photo/resident-ref for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Next of kin page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /next-of-kin/resident-ref for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Carer page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /carer/resident-ref for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Household page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /household for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Rent page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /rent for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Other property page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /other-property for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Rooms page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /rooms for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Laminated flooring page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /laminated-flooring for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Structural changes page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /structural-changes for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Damage page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /damage for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Roof page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /roof for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Loft page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /loft for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Garden page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /garden for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Storing materials page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /storing-materials for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Fire exit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /fire-exit for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Smoke alarm page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /smoke-alarm for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Metal gates page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /metal-gates for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Door mats page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /door-mats for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Communal areas page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /communal-areas for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Pets page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /pets for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Antisocial behaviour page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /antisocial-behaviour for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Other comments page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /other-comments for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Home check page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /home-check for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Health page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /health for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Disability page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /disability for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Support needs page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /support-needs for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Review page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /review for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Closed review page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /closed-review for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Manager review page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /manager-review for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Submit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /submit for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Confirmed page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /confirmed for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: First failed attempt page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /first-failed-attempt for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Second failed attempt page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /second-failed-attempt for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Third failed attempt page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /third-failed-attempt for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Fourth failed attempt page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /fourth-failed-attempt for the process
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Unable to enter closed review page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /unable-to-enter-closed-review for the process
    Then the page should be accessible
    And the page should have a descriptive title
