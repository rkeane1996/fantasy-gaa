@CleanDB
Feature: Test Scenarios to test updating Player information

Background:
    Given the application has authorized and authenticated users
      | firstName | club     | role  |
      | tim       | NaFianna | Admin |

Scenario: Attempt to update a player's price
    Given the application has 1 players
    And the price for a player is changed to 5.6
    When a updatePlayerPrice request is made to the service
    Then the "updatePlayerPrice" request should succeed with a status of "OK"
    And player price is updated

Scenario: Attempt to update price of player with negative value
    Given the application has 1 players
    And the price for a player is changed to -10
    When a updatePlayerPrice request is made to the service
    Then the "updatePlayerPrice" request should fail with a status of "Bad Request"

Scenario: Attempt update a player's price but user does not have permissions
    Given the application has authorized and authenticated users
        | firstName | club     | role |
        | tim       | NaFianna | user |
    When a updatePlayerPrice request is made to the service
    Then the "updatePlayerPrice" request should fail with a status of "Forbidden"

Scenario: Attempt update a player's price without an auth token
    But users token is empty
    When a updatePlayerPrice request is made to the service
    Then the "updatePlayerPrice" request should fail with a status of "Unauthorized"

Scenario: Attempt update a player's price with an invalid token
    But users token is invalid
    When a updatePlayerPrice request is made to the service
    Then the "updatePlayerPrice" request should fail with a status of "Unauthorized"

Scenario: Attempt to update a player's status
    Given the application has 1 players
    And the status for a player is changed
    When a updatePlayerStatus request is made to the service
    Then the "updatePlayerStatus" request should succeed with a status of "OK"
    And player status is updated

Scenario: Attempt to update a player's status with an invalid status value
    Given the application has 1 players
    And the status for a player is changed to invalid value
    When a updatePlayerStatus request is made to the service
    Then the "updatePlayerStatus" request should fail with a status of "Bad Request"

Scenario: Attempt update a player's price but user does not have permissions
    Given the application has authorized and authenticated users
        | firstName | club     | role |
        | tim       | NaFianna | user |
    When a updatePlayerStatus request is made to the service
    Then the "updatePlayerStatus" request should fail with a status of "Forbidden"

Scenario: Attempt update a player's price without an auth token
    But users token is empty
    When a updatePlayerStatus request is made to the service
    Then the "updatePlayerStatus" request should fail with a status of "Unauthorized"

Scenario: Attempt update a player's price with an invalid token
    But users token is invalid
    When a updatePlayerStatus request is made to the service
    Then the "updatePlayerStatus" request should fail with a status of "Unauthorized"