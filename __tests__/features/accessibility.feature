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

  Scenario: Sections page is accessible
    When I visit /sections
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Visit attempt page is accessible
    When I visit /visit-attempt
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Start check page is accessible
    When I visit /start-check
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: About visit page is accessible
    When I visit /about-visit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Submit page is accessible
    When I visit /submit
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Confirmed page is accessible
    When I visit /confirmed
    Then the page should be accessible
    And the page should have a descriptive title
