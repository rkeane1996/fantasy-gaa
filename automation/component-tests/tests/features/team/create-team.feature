@CleanDB
Feature: Component test to test create team endpoint

  Background:
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | User |

  Scenario: Attempt to create a team
    Given the application has 50 players
    And user chooses the players for the team
    When a createTeam request is made to the service
    Then the "createTeam" request should succeed with a status of "CREATED"
    And a team is created

  Scenario Outline: Attempt to create a team with missing properties
    Given the application has 50 players
    And user chooses the players for the team
    But user forgets to add "<property>"
    When a createTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Bad Request"

    Examples:
      | property |
      | userId   |
      | teamInfo |
      | players  |
      | budget   |

  Scenario Outline: Attempt to create a team with less/more that 18 players
    Given the application has 50 players
    And user chooses the players for the team
    But users team has <numberOfPlayers> players
    When a createTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Bad Request"
    
    Examples:
      | numberOfPlayers |
      |               5 |
      |              20 |

  Scenario: Attempt to create a team without a auth token
    Given the application has 50 players
    And user chooses the players for the team
    But users token is empty
    When a createTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Unauthorized"

  Scenario: Attempt to create a team without an invalid token
    Given the application has 50 players
    And user chooses the players for the team
    But users token is invalid
    When a createTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Unauthorized"

    Scenario: Attempt to create a team but user does not have permissions
    Given the application has 50 players
    And user chooses the players for the team
    Given the application has authorized and authenticated users
        | firstName | club     | role |
        | tim       | NaFianna | user |
    When a createTeam request is made to the service
    Then the "createTeam" request should fail with a status of "Forbidden"
