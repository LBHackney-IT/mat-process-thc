Feature: Accessibility

  As a user with access needs
  I want to have my needs met
  So that I can use the service

  Scenario: Index page is accessible
    When I visit /
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Loading page is accessible
    When I visit /loading
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Loading page is accessible when it's finished loading
    When I visit /loading
    And I wait for the data to be fetched
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Sections page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /sections
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Verify tenant details page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /verify
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Outside page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /outside
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Start page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /start
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: About visit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /about-visit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Present for check page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /present-for-check
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: ID page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /id/resident-ref
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Residency page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /residency/resident-ref
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Tenant photo page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /tenant-photo/resident-ref
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Next of kin page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /next-of-kin/resident-ref
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Carer page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /carer/resident-ref
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Household page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /household
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Rent page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /rent
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Other property page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /other-property
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Rooms page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /rooms
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Laminated flooring page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /laminated-flooring
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Structural changes page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /structural-changes
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Damage page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /damage
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Roof page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /roof
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Loft page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /loft
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Garden page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /garden
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Storing materials page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /storing-materials
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Fire exit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /fire-exit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Smoke alarm page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /smoke-alarm
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Metal gates page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /metal-gates
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Door mats page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /door-mats
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Communal areas page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /communal-areas
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Pets page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /pets
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Antisocial behaviour page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /antisocial-behaviour
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Other comments page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /other-comments
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Home check page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /home-check
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Health page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /health
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Disability page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /disability
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Support needs page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /support-needs
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Review page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /review
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Submit page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /submit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Confirmed page is accessible
    When I start the process
    And I wait for the data to be fetched
    And I visit /confirmed
    Then the page should be accessible
    And the page should have a descriptive title
