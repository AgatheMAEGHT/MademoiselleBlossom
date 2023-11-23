package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestWhoAmI(t *testing.T) {
	tok := createTestAccount(t, "test@test.fr")
	defer deleteAccount(t, tok)
	assert.NotEmpty(t, tok)

	result, status := requester("/who-am-i", http.MethodGet, nil, tok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"], result)
	assert.NotEmpty(t, result["email"], result)
	assert.NotEmpty(t, result["firstName"], result)
	assert.NotEmpty(t, result["lastName"], result)
	assert.Contains(t, "truefalse", fmt.Sprintf("%t", result["isAdmin"]), result)
}

func TestUpdateAccount(t *testing.T) {
	tok := createTestAccount(t, "test@test.fr")
	defer deleteAccount(t, tok)
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
}

func TestChangePassword(t *testing.T) {
	testTok := createTestAccount(t, "test@test.fr")
	defer deleteAccount(t, testTok)
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
	defer deleteAccount(t, notAdminTok)

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
