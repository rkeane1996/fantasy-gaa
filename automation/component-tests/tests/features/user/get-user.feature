@CleanUser
Feature: Test Scenarios to test the retrieval of User data

Scenario: Attempt to retrieve a specific users
    Given the application has authorized and authenticated users
        |firstName | club     | role |
        | tim      | NaFianna | User |
        | bob      | Carnmore | User |
        | bill     | NaFianna | User |
    When a getUser request is made to the service
    Then the "getUser" request should succeed with a status of "OK"
    And a users details is returned

Scenario: Attempt to retrieve a specific users but user does not have permissions
    Given the application has authorized and authenticated users
        |firstName | club     | role |
        | tim      | NaFianna | user |
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Forbidden"

Scenario: Attempt to retrieve a specific users without a auth token
    Given the application has authorized and authenticated users
        |firstName | club     | role |
        | tim      | NaFianna | user |
    But users token is empty
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Unauthorized"

Scenario: Attempt to retrieve a specific users without an invalid token
   Given the application has authorized and authenticated users
        |firstName | club     | role |
        | tim      | NaFianna | user |
    But users token is invalid
    When a getUser request is made to the service
    Then the "getUser" request should fail with a status of "Unauthorized"