package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTone(t *testing.T) {
	testTok := createTestAccount(t, "test@articletype.com")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Post article type
	body := map[string]interface{}{
		"name": "test",
	}

	// Not logged
	result, status := requester("/tone/create", http.MethodPost, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/tone/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post a second article type to test get
	body["name"] = "test2"
	result, status = requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res2, ok := result["_id"].(string)
	assert.True(t, ok)
	res2Name, ok := result["name"].(string)
	assert.True(t, ok)

	// Dup article type
	result, status = requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Put article type
	body = map[string]interface{}{
		"_id":  res1,
		"name": "testPut",
	}

	// Not logged
	result, status = requester("/tone/update", http.MethodPut, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/tone/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/tone/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["name"])
	resName, ok := result["name"].(string)
	assert.True(t, ok)
	assert.Equal(t, body["name"], resName)

	// Get article type
	resultList, status, err := requesterList("/tone", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 2, len(resultList))

	// Get article type by id
	resultList, status, err = requesterList(fmt.Sprintf("/tone?_id=%s", res1), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList))

	// Get article type by name
	resultList, status, err = requesterList(fmt.Sprintf("/tone?name=%s", res2Name), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList))

	// Delete article type

	// Not logged
	result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", res1), http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", res1), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", res1), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", res2), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])
}
