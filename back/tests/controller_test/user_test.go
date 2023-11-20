package controller_test

import (
	"MademoiselleBlossom/database"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

var ctx = context.Background()

func requester(path string, method string, body map[string]interface{}, auth string) (map[string]interface{}, int) {
	url := "http://localhost:8080" + path
	jsonStr, err := json.Marshal(body)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonStr))
	if err != nil {
		panic(err)
	}
	req.Header.Set("Content-Type", "application/json")
	if auth != "" {
		req.Header.Set("Authorization", "Bearer "+auth)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	result := make(map[string]interface{})
	json.NewDecoder(resp.Body).Decode(&result)
	return result, resp.StatusCode
}

func getAdminAccessToken(t *testing.T) string {
	body := map[string]interface{}{
		"email":    "quentinescudier@hotmail.fr",
		"password": "admin",
	}
	result, status := requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])
	res, ok := result["access_token"].(string)
	assert.True(t, ok)
	return res
}

func createTestAccount(t *testing.T) string {
	body := map[string]interface{}{
		"email":     "test@test.fr",
		"firstName": "test",
		"lastName":  "test",
		"password":  "test",
	}
	result, status := requester("/register", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])

	res, ok := result["access_token"].(string)
	assert.True(t, ok)
	return res
}

func deleteAccount(t *testing.T, tok string) {
	result, status := requester("/user/delete", http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}

func TestChangePassword(t *testing.T) {
	testTok := createTestAccount(t)
	assert.NotEmpty(t, testTok)

	body := map[string]interface{}{
		"newPassword": "test2",
		"oldPassword": "test",
	}
	result, status := requester("/user/password", http.MethodPut, body, testTok)
	assert.Equal(t, 200, status, result["err"])
	// Login with new password
	body = map[string]interface{}{
		"email":    "test@test.fr",
		"password": "test2",
	}
	result, status = requester("/login", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/delete", http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Missing password
	body = map[string]interface{}{
		"password": "",
	}
	result, status = requester("/user/password", http.MethodPut, body, testTok)
	assert.Equal(t, 400, status, result["err"])

	/* Test as admin */
	// Connect to db
	_, err := database.Connect(ctx, "mongodb://localhost:27017")
	fmt.Println("Connected")
	assert.NoError(t, err)

	testUser := database.User{
		Email:     "test",
		FirstName: "test",
		LastName:  "test",
		Password:  "test",
	}
	_, err = testUser.CreateOne(ctx)
	assert.NoError(t, err)
	// Not admin
	body = map[string]interface{}{
		"newPassword": "test2",
		"oldPassword": "test",
	}

	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testUser.ID.Hex()), http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	tok := getAdminAccessToken(t)
	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testUser.ID.Hex()), http.MethodPut, body, tok)
	assert.Equal(t, 200, status, result["err"])

	deleteAccount(t, testTok)
	_, err = testUser.DeleteOne(ctx)
	assert.NoError(t, err)
}

func TestDeleteAccount(t *testing.T) {
	tok := createTestAccount(t)
	assert.NotEmpty(t, tok)
	result, status := requester("/user/delete", http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/delete", http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	/* Test as admin */
	// Connect to db
	_, err := database.Connect(ctx, "mongodb://localhost:27017")
	fmt.Println("Connected")
	assert.NoError(t, err)

	testUser := database.User{
		Email:     "test",
		FirstName: "test",
		LastName:  "test",
		Password:  "test",
	}
	_, err = testUser.CreateOne(ctx)
	assert.NoError(t, err)
	// Not admin
	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testUser.ID.Hex()), http.MethodDelete, nil, tok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	tok = getAdminAccessToken(t)
	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testUser.ID.Hex()), http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}

func TestRegister(t *testing.T) {
	body := map[string]interface{}{
		"email":     "test@test.fr",
		"firstName": "test",
		"lastName":  "test",
		"password":  "test",
	}
	result, status := requester("/register", http.MethodPost, body, "")
	assert.Equal(t, 200, status, result["err"])
	resBody, ok := result["access_token"].(string)
	assert.True(t, ok)
	assert.NotEmpty(t, resBody)

	/* Test with error */
	// User already exists
	result, status = requester("/register", http.MethodPost, body, "")
	assert.Equal(t, 400, status, result["err"])

	// Delete test account
	deleteAccount(t, resBody)

	// Missing email
	body = map[string]interface{}{
		"firstName": "test",
		"lastName":  "test",
		"password":  "test",
	}
	result, status = requester("/register", http.MethodPost, body, "")
	assert.Equal(t, 400, status, result["err"])
}

func TestLogin(t *testing.T) {
	tok := getAdminAccessToken(t)

	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])
}
