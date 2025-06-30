Feature: Component test to test get team endpoint

  Scenario Outline: Attempt to get teams
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | User |
    And <numberOfTeams> team is created
    When user want to retrieve <numberOfTeams> team
    And a getTeam request is made to the service
    Then the "getTeam" request should succeed with a status of "OK"
    And teams is returned

    Examples:
    | numberOfTeams |
    |1|
    |4|

  Scenario: Attempt to get teams with incorrect team id
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | User |
    And 1 team is created
    When user want to retrieve 1 team
    But team id is incorrect
    And a getTeam request is made to the service
    Then the "getTeam" request should succeed with a status of "OK"
    And no team is returned
  
  Scenario: Attempt to get a team without a auth token
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | User |
    And 1 team is created
    When user want to retrieve 1 team
    But users token is empty
    When a getTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Unauthorized"

  Scenario: Attempt to create a team without an invalid token
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | User |
    And 1 team is created
    When user want to retrieve 1 team
    But users token is invalid
    When a getTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Unauthorized"

  Scenario: Attempt to create a team but user does not have permissions
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | user |
    And 1 team is created
    When user want to retrieve 1 team
    When a getTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Forbidden"
