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

# Scenario: Starting the process while offline
#   Given I am offline
#   When I start the process
#   Then I should see that I need to go online to continue
#   And I shouldn't be able to continue

# Scenario: Going online while starting the process
#   Given I am offline
#   When I start the process
#   And I go online
#   And I wait for the data to be fetched
#   Then the data for the process should be available
#   And I should be able to continue
