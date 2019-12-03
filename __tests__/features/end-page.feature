Feature: End page

  As a user
  I want to know that the process was submitted
  So that I know it's safe to close it

  Scenario: Page is the end page
    When I visit /end
    Then the page title should be "Tenancy & Household Check - Complete"
    And I should see "Process submission confirmed" on the page

  Scenario: Page has no accessibility violations
    When I visit /end
    Then the page should be accessible
