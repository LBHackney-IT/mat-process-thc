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

  Scenario: ID page is accessible
    When I visit /id
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Residency page is accessible
    When I visit /residency
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Tenant photo page is accessible
    When I visit /tenant-photo
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Next of kin page is accessible
    When I visit /next-of-kin
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Carer page is accessible
    When I visit /carer
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Rooms page is accessible
    When I visit /rooms
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Laminated flooring page is accessible
    When I visit /laminated-flooring
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Structural changes page is accessible
    When I visit /structural-changes
    Then the page should be accessible
    And the page should have a descriptive title

  Scenario: Damage page is accessible
    When I visit /damage
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
