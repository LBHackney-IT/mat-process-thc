Feature: Accessibility

  As a user with access needs
  I want to have my needs met
  So that I can use the service

  Scenario: Index page is accessible
    When I visit /
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Attempt visit page is accessible
    When I visit /attempt-visit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Start visit page is accessible
    When I visit /start-visit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Sections page is accessible
    When I visit /sections
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Submit page is accessible
    When I visit /submit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: End page is accessible
    When I visit /end
    Then the page should be accessible
    And the page should have a descriptive title
