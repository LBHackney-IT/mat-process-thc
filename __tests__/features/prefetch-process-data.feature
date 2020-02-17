Feature: Prefetch process data

  As a user
  I want the service to prefetch the data needed for the process
  So that I can work offline

  Scenario: Starting the process while online
    Given I am online
    When I start the process
    And I wait for the data to be fetched
    Then I should see the tenancy details
    And I should be able to continue
