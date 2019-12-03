Feature: Submit page

  As a user
  I want the submit page to submit the completed process
  So that my work will be recorded

  Scenario: Page is the submit page
    When I visit /submit
    Then the page title should be "Tenancy & Household Check - Submit"
    And I should see "Process submission pending" on the page

  Scenario: Page indicates that it's offline
    Given I am offline
    When I visit /submit
    Then I should see "You are currently working offline" on the page

  Scenario: Page indicates that it's online
    Given I am online
    When I visit /submit
    And I wait for the data to sync
    Then I should see "You are now online" on the page

  Scenario: Page has no accessibility violations
    When I visit /submit
    Then the page should be accessible
