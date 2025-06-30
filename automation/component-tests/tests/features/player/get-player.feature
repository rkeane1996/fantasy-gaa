@CleanDB
Feature: Test Scenarios to test the get players api

  Background:
    Given the application has authorized and authenticated users
      | firstName | club     | role  |
      | tim       | NaFianna | Admin |

  Scenario: Attempt to retrieve a player
    Given the application has 3 players
    When a getPlayer request is made to the service to retrieve 2 players
    Then the "getPlayer" request should succeed with a status of "OK"
    And players are retrieve

  Scenario: Attempt to retrieve a player that does not exist
    Given the application has 1 players
    But that player does not exist
    When a getPlayer request is made to the service to retrieve 1 players
    Then the "getPlayer" request should succeed with a status of "OK"
    And no players are returned

  Scenario: Attempt to retrieve a player that does not exist and a player that does
    Given the application has 2 players
    But that player does not exist
    When a getPlayer request is made to the service to retrieve 2 players
    Then the "getPlayer" request should succeed with a status of "OK"
    And non existing player and player are returned

  Scenario: Attempt to retrieve a player but user does not have permissions
    Given the application has authorized and authenticated users
      | firstName | club     | role |
      | tim       | NaFianna | user |
    When a getPlayer request is made to the service to retrieve 1 players
    Then the "getPlayer" request should fail with a status of "Forbidden"

  Scenario: Attempt to retrieve a player without an auth token
    But users token is empty
    When a getPlayer request is made to the service to retrieve 1 players
    Then the "getPlayer" request should fail with a status of "Unauthorized"

  Scenario: Attempt to retrieve a player with an invalid token
    But users token is invalid
    When a getPlayer request is made to the service to retrieve 1 players
    Then the "getPlayer" request should fail with a status of "Unauthorized"
