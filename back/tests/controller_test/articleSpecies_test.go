package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestArticleSpecies(t *testing.T) {
	testTok := createTestAccount(t, "test@articlespecies.com")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Get article species number
	resultList, status, err := requesterList("/article-species", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	nbArticleSpecies := len(resultList)

	// Post article species
	body := map[string]interface{}{
		"name": "test",
	}

	// Not logged
	result, status := requester("/article-species/create", http.MethodPost, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/article-species/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/article-species/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post a second article species to test get
	body["name"] = "test2"
	result, status = requester("/article-species/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res2, ok := result["_id"].(string)
	assert.True(t, ok)
	res2Name, ok := result["name"].(string)
	assert.True(t, ok)

	// Dup article species
	result, status = requester("/article-species/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Put article species
	body = map[string]interface{}{
		"_id":  res1,
		"name": "testPut",
	}

	// Not logged
	result, status = requester("/article-species/update", http.MethodPut, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/article-species/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/article-species/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["name"])
	resName, ok := result["name"].(string)
	assert.True(t, ok)
	assert.Equal(t, body["name"], resName)

	// Get article species
	resultList, status, err = requesterList("/article-species", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 2+nbArticleSpecies, len(resultList))

	// Get article species by id
	resultList, status, err = requesterList(fmt.Sprintf("/article-species?_id=%s", res1), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList))

	// Get article species by name
	resultList, status, err = requesterList(fmt.Sprintf("/article-species?name=%s", res2Name), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 1, len(resultList))

	// Delete article species

	// Not logged
	result, status = requester(fmt.Sprintf("/article-species/delete?_id=%s", res1), http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester(fmt.Sprintf("/article-species/delete?_id=%s", res1), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/article-species/delete?_id=%s", res1), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester(fmt.Sprintf("/article-species/delete?_id=%s", res2), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])
}
