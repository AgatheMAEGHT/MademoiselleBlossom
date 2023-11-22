package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTextBlock(t *testing.T) {
	testTok := createTestAccount(t, "test@textBlock.com")
	adminTok := getAdminAccessToken(t)

	// Post textBlock
	body := map[string]interface{}{
		"name":    "test",
		"content": "000000",
	}

	// Not logged
	result, status := requester("/text-block/create", http.MethodPost, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/text-block/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin

	// No Content
	result, status = requester("/text-block/create", http.MethodPost, map[string]interface{}{"name": "test"}, adminTok)
	assert.Equal(t, 400, status, result["err"])

	result, status = requester("/text-block/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post a second textBlock to test get
	body["name"] = "test2"
	body["content"] = "ffffff"
	result, status = requester("/text-block/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res2, ok := result["_id"].(string)
	assert.True(t, ok)
	res2Name, ok := result["name"].(string)
	assert.True(t, ok)

	// Dup textBlock
	result, status = requester("/text-block/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Put textBlock
	body = map[string]interface{}{
		"_id":     res1,
		"name":    "testPut",
		"content": "eeeeee",
	}

	// Not logged
	result, status = requester("/text-block/update", http.MethodPut, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/text-block/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/text-block/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["name"])
	resName, ok := result["name"].(string)
	assert.True(t, ok)
	assert.Equal(t, body["name"], resName)

	// Get textBlock
	resultList, status, err := requesterList("/text-block", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 2, len(resultList), resultList)

	// Get textBlock by id
	resultList, status, err = requesterList(fmt.Sprintf("/text-block?_id=%s", res1), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Get textBlock by name
	resultList, status, err = requesterList(fmt.Sprintf("/text-block?name=%s", res2Name), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Get textBlock by content
	resultList, status, err = requesterList(fmt.Sprintf("/text-block?content=%s", "ffffff"), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Delete textBlock

	// Not logged
	result, status = requester(fmt.Sprintf("/text-block/delete?_id=%s", res1), http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester(fmt.Sprintf("/text-block/delete?_id=%s", res1), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/text-block/delete?_id=%s", res1), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester(fmt.Sprintf("/text-block/delete?_id=%s", res2), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	deleteAccount(t, testTok)
}
