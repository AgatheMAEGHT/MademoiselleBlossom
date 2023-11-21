package controller_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func requesterList(path string, method string, body map[string]interface{}, auth string) ([]map[string]interface{}, int, string) {
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

	if resp.StatusCode != 200 {
		result := make(map[string]interface{})
		json.NewDecoder(resp.Body).Decode(&result)
		return nil, resp.StatusCode, result["err"].(string)
	}

	result := make([]map[string]interface{}, 0)
	json.NewDecoder(resp.Body).Decode(&result)
	return result, resp.StatusCode, ""
}

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

func createTestAccount(t *testing.T, email string) string {
	body := map[string]interface{}{
		"email":     email,
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

func TestWhoAmI(t *testing.T) {
	tok := createTestAccount(t, "test@test.fr")
	assert.NotEmpty(t, tok)

	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])

	deleteAccount(t, tok)
}

func TestUpdateAccount(t *testing.T) {
	tok := createTestAccount(t, "test@test.fr")
	assert.NotEmpty(t, tok)

	body := map[string]interface{}{
		"firstName": "test2",
		"lastName":  "test2",
	}
	result, status := requester("/user/update", http.MethodPut, body, tok)
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/update", http.MethodPut, nil, "")
	assert.Equal(t, 401, status, result["err"])

	deleteAccount(t, tok)
}

func TestChangePassword(t *testing.T) {
	testTok := createTestAccount(t, "test@test.fr")
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

	// Get test@test.fr id with who-am-i
	result, status = requester("/who-am-i", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	testId, ok := result["_id"].(string)
	assert.True(t, ok)

	// Not admin
	notAdminTok := createTestAccount(t, "test2@test.fr")

	// Update password
	body = map[string]interface{}{
		"newPassword": "test3",
		"oldPassword": "test2",
	}
	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testId), http.MethodPut, body, notAdminTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	adminTok := getAdminAccessToken(t)
	result, status = requester(fmt.Sprintf("/user/password?_id=%s", testId), http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])

	deleteAccount(t, testTok)
	deleteAccount(t, notAdminTok)
}

func TestDeleteAccount(t *testing.T) {
	tok := createTestAccount(t, "test@test.fr")
	assert.NotEmpty(t, tok)
	result, status := requester("/user/delete", http.MethodDelete, nil, tok)
	assert.Equal(t, 200, status, result["err"])

	/* Test with error */
	// No token
	result, status = requester("/user/delete", http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	/* Test as admin */

	// Not admin

	// Create test account
	testTok := createTestAccount(t, "test2@test.fr")
	assert.NotEmpty(t, testTok)
	result, status = requester("/who-am-i", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	testId, ok := result["_id"].(string)
	assert.True(t, ok)

	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testId), http.MethodDelete, nil, tok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	tok = getAdminAccessToken(t)
	result, status = requester(fmt.Sprintf("/user/delete?_id=%s", testId), http.MethodDelete, nil, tok)
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
