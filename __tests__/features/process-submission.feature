Feature: Process submission

  As a user
  I want to know when the process has been submitted
  So that I know it's safe to close it

  Scenario: Submitting while online
    Given I am at the end of the process
    And I am online
    When I submit the process
    Then I should see that the process has been submitted

# Scenario: Waiting for connection
#   Given I am at the end of the process
#   And I am offline
#   Then I should see that I need to go online to continue
#   And I shouldn't be able to continue

# Scenario: Going online to submit
#   Given I am at the end of the process
#   And I am offline
#   When I go online
#   And I submit the process
#   Then I should see that the process has been submitted
