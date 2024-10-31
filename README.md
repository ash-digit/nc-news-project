# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

Project Name: NC_NEWS API

Table of Contents

    1.	Overview
    2.	Features
    3.	Setup
    4.	Environment Variables
    5.	Endpoints
    6.	Error Handling
    7.	Testing

Overview

Project Description

Here’s a project description based on the code:

Project Description

The NC News API is a RESTful web service providing access to a rich database of articles, topics, users, and comments. This API allows clients to retrieve, update, delete, and manage news articles and related data, facilitating comprehensive article querying, topic and user management, and comment posting. The API includes robust error handling to provide informative feedback when requests are invalid or data is unavailable.

This project is designed to demonstrate test-driven development principles, with comprehensive endpoint tests using the Supertest library to ensure correct functionality and error handling. Key endpoints include:

    •	GET /api/topics - Returns all available topics.
    •	GET /api - Provides a JSON list of all API endpoints.
    •	GET /api/articles/:article_id - Retrieves a specific article by ID.
    •	GET /api/articles - Fetches a list of articles, with optional sorting and filtering by date, author, or topic.
    •	GET /api/articles/:article_id/comments - Fetches comments related to a specified article.
    •	POST /api/articles/:article_id/comments - Adds a new comment to a specific article.
    •	PATCH /api/articles/:article_id - Updates article votes.
    •	DELETE /api/comments/:comment_id - Removes a comment by ID.
    •	GET /api/users - Lists all users with relevant details.

Error handling includes responses for resource unavailability (404), invalid endpoints (404), and malformed requests (400). The database is reset before each test to ensure consistency and reliability.

This API is ideal for content-rich applications that rely on structured data querying, such as news websites or forums, where users interact with articles, topics, and comments.

Tech Stack

    •	Node.js
    •	Express
    •	PostgreSQL (or your chosen database)
    •	Jest and Supertest (for testing)

Features

    •	CRUD Operations: Create, Read, Update, and Delete for various resources like articles, users, and comments.
    •	Parameter and Query Support: Allows for customizable data retrieval with parameters and query strings.
    •	Error Handling: Comprehensive error handling for different status codes.
    •	Authentication (if applicable): Briefly explain any authentication features.

Setup

Prerequisites

    •Node.js (v14+ recommended)
    •PostgreSQL

Installation

    1.	Clone the repository

    https://github.com/ash-digit/news-api

    2.	Navigate into the directory

cd yourrepository

    3.	Install dependencies

npm install

    4.	Setup the database
    •	Ensure PostgreSQL is running.
    •	Create a new database for the project (or two, if using a test database).
    •	Run the SQL migration files to set up tables, constraints, and seed data.

Environment Variables

Create a .env file in the root of your project and set up these environment variables.

file: .env.development ---> copy the code in the current file
PGDATABASE=nc_news

file: .enve.test ---> copy the code in the current file
PGDATABASE=nc_news_test

Endpoints

GET /topics

    1.	200: Returns an array of topic objects
    •	Ensures the /api/topics endpoint returns an array of topics, each with slug and description properties.
    2.	404: Returns a 404 error for an invalid endpoint
    •	Checks that a request to an invalid endpoint /api/bad-things returns a 404 status.

GET /api

    1.	200: Returns a JSON object with all available endpoints
    •	Verifies that /api returns an object with details about each endpoint, including descriptions.
    2.	404: Returns a 404 error for an invalid endpoint
    •	Ensures an invalid path (e.g., /api/invalid-endpoint) returns a 404 status.

GET /api/articles/:article_id

    1.	200: Returns an article object by article_id
    •	Checks that /api/articles/:article_id returns an article with expected properties for a valid ID.
    2.	400: Returns a 400 error for a non-numeric article_id
    •	Tests that /api/articles/five returns a 400 Bad Request due to a non-numeric ID.
    3.	404: Returns a 404 error for a non-existent article_id
    •	Ensures that /api/articles/90000 (an ID out of range) returns a 404 Not Found.
    4.	200: Returns articles filtered by topic
    •	Verifies that /api/articles/:topic returns an array of articles for a specific topic.
    5.	400: Returns a 400 error for a non-existent topic
    •	Ensures that an invalid topic (e.g., /api/articles/SuperCars) returns a 400 Bad Request.
    6.	200: Returns the count of comments for an article
    •	Confirms /api/articles/:article_id?count=true returns the count of comments for the specified article.
    7.	200: Returns an article with details when count=false
    •	Verifies that /api/articles/:article_id?count=false returns an article with all relevant details.
    8.	404: Returns a 404 error for a non-existent article with count=true
    •	Tests that /api/articles/100000?count=true returns a 404 Not Found if the article doesn’t exist.
    9.	400: Returns a 400 error for an invalid topic with count=true
    •	Checks that /api/articles/SuperCars?count=true returns a 400 error for a non-existent topic.
    10.	400: Returns a 400 error for an invalid topic with count=false
    •	Verifies that /api/articles/SuperCars?count=false returns a 400 error for a non-existent topic.

GET /api/articles

    1.	200: Returns an array of articles with required properties
    •	Ensures /api/articles returns an array of articles with properties excluding body.
    2.	200: Returns articles ordered by created_at by default
    •	Confirms /api/articles?sortedBy=created_at&orderedBy=DESC returns articles ordered by created_at.
    3.	200: Returns articles ordered by author in descending order
    •	Tests that /api/articles?sortedBy=author&orderedBy=DESC returns articles ordered by author in descending order.
    4.	200: Returns articles ordered by title in ascending order
    •	Ensures /api/articles?sortedBy=title&orderedBy=ASC returns articles ordered by title in ascending order.
    5.	400: Returns 400 error for invalid query parameters
    •	Checks that /api/articles/?sortedBy=date&orderedBy=ESC returns a 400 error for invalid sorting parameters.

GET /api/articles/:article_id/comments

    1.	200: Returns an array of comments for a valid article ID
    •	Verifies /api/articles/3/comments returns an array of comments for the specified article ID.
    2.	200: Returns an empty array for articles without comments
    •	Ensures /api/articles/4/comments returns an empty array if the article has no comments.
    3.	404: Returns 404 for non-existent article ID
    •	Confirms /api/articles/999/comments returns a 404 Not Found for an invalid article ID.
    4.	400: Returns 400 for invalid non-numeric article ID
    •	Checks that /api/articles/two/comments returns a 400 Bad Request for an invalid ID.

PATCH /api/articles/:article_id

    1.	201: Updates article votes and returns updated article
    •	Ensures /api/articles/:article_id increments/decrements votes and returns the updated article.
    2.	404: Returns 404 for non-existent article ID
    •	Checks /api/articles/999 returns a 404 for a non-existent article ID.
    3.	400: Returns 400 for invalid non-numeric article ID
    •	Tests /api/articles/one returns a 400 error if article_id is not numeric.
    4.	400: Returns 400 for non-numeric inc_votes value
    •	Verifies /api/articles/1 with non-numeric inc_votes value returns a 400 Bad Request.

DELETE /api/comments/:comment_id

    1.	204: Deletes a comment by valid comment_id
    •	Ensures /api/comments/1 successfully deletes a comment with a valid ID, returning 204.
    2.	404: Returns 404 for non-existent comment_id
    •	Verifies /api/comments/999 returns a 404 error for a non-existent comment_id.
    3.	400: Returns 400 for invalid non-numeric comment_id
    •	Confirms /api/comments/one returns a 400 error for a non-numeric comment_id.

POST /api/articles/:article_id/comments

    1.	201: Creates a new comment for a valid article ID
    •	Tests that /api/articles/3/comments successfully creates and returns a new comment.
    2.	404: Returns 404 for non-existent article ID
    •	Checks /api/articles/3333/comments returns a 404 error if the article ID doesn’t exist.
    3.	404: Returns 404 for non-existent username
    •	Verifies /api/articles/3/comments returns a 404 error if the author in the request body is invalid.
    4.	400: Returns 400 for non-numeric article ID
    •	Ensures /api/articles/three/comments returns a 400 error if article_id is non-numeric.

GET /api/users

    1.	200: Returns an array of user objects with name, username, and avatar_url
    •	Confirms /api/users returns an array of users, each with the required properties.
    2.	404: Returns 404 for an invalid endpoint
    •	Checks /api/bad-things returns a 404 error for an invalid endpoint.

Each test is structured to verify that endpoints handle both valid and invalid cases correctly, ensuring robust functionality and error handling.

Error Handling

Status Code Description
400 Bad Request
404 Not Found
500 Internal Server Error

Testing

Running Tests

Tests are written using Jest and Supertest. To run tests, use:

npm test

Example Test

Example of testing an endpoint to get articles:

test("GET /api/articles returns an array of articles", () => {
return request(app)
.get("/api/articles")
.expect(200)
.then(({ body }) => {
expect(Array.isArray(body.articles)).toBe(true);
});
});
