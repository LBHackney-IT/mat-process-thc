Feature: Index page

  As a user
  I want to visit the index page
  So that I can start using the service

  Scenario: Page has content
    When I visit /
    Then the page title should be "Tenancy & Household Check - Index"
    And I should see "This will be a start page!" on the page

  Scenario: Page has no accessibility violations
    When I visit /
    Then the page should be accessible
