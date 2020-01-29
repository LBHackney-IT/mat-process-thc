Feature: Process submission

  As a user
  I want to know when the process has been submitted
  So that I know it's safe to close it

  Scenario: Submitting while online
    Given I am at the end of the process
    And I am online
    When I submit the process
    And I wait for the submission to finish
    Then I should see that the process has been submitted
