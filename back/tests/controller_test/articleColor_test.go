package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestArticleColor(t *testing.T) {
	testTok := createTestAccount(t, "test@articlecolor.com")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Post color
	body := map[string]interface{}{
		"name": "test",
		"hexa": "000000",
	}

	// Not logged
	result, status := requester("/article-color/create", http.MethodPost, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/article-color/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin

	// No Hexa
	result, status = requester("/article-color/create", http.MethodPost, map[string]interface{}{"name": "test"}, adminTok)
	assert.Equal(t, 400, status, result["err"])

	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post a second color to test get
	body["name"] = "test2"
	body["hexa"] = "ffffff"
	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res2, ok := result["_id"].(string)
	assert.True(t, ok)
	res2Name, ok := result["name"].(string)
	assert.True(t, ok)

	// Dup color
	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Put color
	body = map[string]interface{}{
		"_id":  res1,
		"name": "testPut",
		"hexa": "eeeeee",
	}

	// Not logged
	result, status = requester("/article-color/update", http.MethodPut, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/article-color/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/article-color/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["name"])
	resName, ok := result["name"].(string)
	assert.True(t, ok)
	assert.Equal(t, body["name"], resName)

	// Get color
	resultList, status, err := requesterList("/article-color", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 2, len(resultList), resultList)

	// Get color by id
	resultList, status, err = requesterList(fmt.Sprintf("/article-color?_id=%s", res1), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Get color by name
	resultList, status, err = requesterList(fmt.Sprintf("/article-color?name=%s", res2Name), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Get color by hexa
	resultList, status, err = requesterList(fmt.Sprintf("/article-color?hexa=%s", "ffffff"), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList), resultList)

	// Delete color

	// Not logged
	result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", res1), http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", res1), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", res1), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", res2), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])
}
