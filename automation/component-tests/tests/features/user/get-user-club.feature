# Feature: Test Scenarios to test the retrieval of User data by club

# Scenario Outline: Attempt to retrieve a specific users by club
#     Given the application has authorized and authenticated users
#         |firstName | club     | role |
#         | tim      | NaFianna | user |
#         | bob      | Carnmore | user |
#         | bill     | NaFianna | user |
#     And I want to get users from <nameOfClub>
#     When a getUserByClub request is made to the service
#     Then the getUserByClub request should succeed with a status of OK
#     And only users that play with <nameOfClub> are returned

#     Examples:
#      | nameOfClub |
#      | NaFianna   |


# Scenario: Attempt to retrieve a specific users from a fake club
#     Given the application has authorized and authenticated users
#         |firstName | club     | role |
#         | tim      | NaFianna | user |
#     And I want to get users from 'FakeClub'
#     But users token is empty
#     When a getUserByClub request is made to the service
#     Then the getUser request should fail with a status of 'Bad Request'

# Scenario: Attempt to retrieve a specific users without a auth token
#     Given the application has authorized and authenticated users
#         |firstName | club     | role |
#         | tim      | NaFianna | user |
#     And I want to get users from 'NaFianna'
#     But users token is empty
#     When a getUserByClub request is made to the service
#     Then the getUser request should fail with a status of 'Unauthorized'

# Scenario: Attempt to retrieve a specific users without an invalid token
#     Given the application has authorized and authenticated users
#         |firstName | club     | role |
#         | tim      | NaFianna | user |
#     And I want to get users from 'NaFianna'
#     But users token is invalid
#     When a getUserByClub request is made to the service
#     Then the getUser request should fail with a status of 'Unauthorized'