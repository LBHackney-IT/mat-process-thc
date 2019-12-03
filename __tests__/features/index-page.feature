Feature: Index page

  As a user
  I want the index page to fetch all the data it will need
  So that I can work offline

  Scenario: Page is the index page
    When I visit /
    Then the page title should be "Tenancy & Household Check"
    And I should see "Tenancy & Household Check" on the page

  Scenario: Go button is disabled when offline
    Given I am offline
    When I visit /
    Then the "Go" button is disabled

  Scenario: Page has no accessibility violations
    When I visit /
    Then the page should be accessible
