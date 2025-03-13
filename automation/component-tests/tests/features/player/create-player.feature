@CleanDB
Feature: Test Scenarios to test the creation of players

Background:
    Given the application has authorized and authenticated users
        | firstName | club     | role |
        | tim       | NaFianna | Admin|

Scenario: Attempt to create a player
    Given a player to create
    When a createPlayer request is made to the service
    Then the "createPlayer" request should succeed with a status of "Created"
    And player is created

Scenario: Attempt to create a player with invalid request body
    Given a player to create
    But request is not valid
    When a createPlayer request is made to the service
    Then the "createPlayer" request should fail with a status of "Bad Request"

Scenario: Attempt to create a player but user does not have permissions
    Given the application has authorized and authenticated users
        | firstName | club     | role |
        | tim       | NaFianna | user |
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Forbidden"

    Scenario: Attempt to create a player without an auth token
    But users token is empty
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Unauthorized"

Scenario: Attempt to create a player with an invalid token
    But users token is invalid
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Unauthorized"