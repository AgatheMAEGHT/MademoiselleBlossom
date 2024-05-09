package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFavorite(t *testing.T) {
	testTok := createTestAccount(t, "test@favorite.com")
	defer deleteAccount(t, testTok)
	testTok2 := createTestAccount(t, "test2@favorite.com")
	defer deleteAccount(t, testTok2)

	deferFunc, articles, _, _, _, _ := PostCompleteArticle(t)
	defer deferFunc()

	// Post favorite
	body := map[string]interface{}{
		"article": articles[0],
	}
	result, status := requester("/favorite/create", http.MethodPost, body, testTok)
	assert.Equal(t, http.StatusOK, status, result["err"])

	body = map[string]interface{}{
		"article": articles[1],
	}
	result, status = requester("/favorite/create", http.MethodPost, body, testTok)
	assert.Equal(t, http.StatusOK, status, result["err"])

	// Post favorite as another user
	body = map[string]interface{}{
		"article": articles[0],
	}
	result, status = requester("/favorite/create", http.MethodPost, body, testTok2)
	assert.Equal(t, http.StatusOK, status, result["err"])

	// Post favorite with invalid article
	body = map[string]interface{}{
		"article": "invalid",
	}
	result, status = requester("/favorite/create", http.MethodPost, body, testTok)
	assert.Equal(t, http.StatusBadRequest, status, result["err"])

	// Post favorite double
	body = map[string]interface{}{
		"article": articles[0],
	}
	result, status = requester("/favorite/create", http.MethodPost, body, testTok)
	assert.Equal(t, http.StatusBadRequest, status, result["err"])

	// Get favorite
	resultListTestUser, status, err := requesterList("/favorite", http.MethodGet, nil, testTok)
	assert.Empty(t, err)
	assert.Equal(t, http.StatusOK, status)
	assert.Equal(t, 2, len(resultListTestUser))

	// Get favorite as another user
	resultListTestUser2, status, err := requesterList("/favorite", http.MethodGet, nil, testTok2)
	assert.Empty(t, err)
	assert.Equal(t, http.StatusOK, status)
	assert.Equal(t, 1, len(resultListTestUser2))

	// Delete favorite
	// Delete favorite as another user
	for _, res := range resultListTestUser {
		result, status = requester(fmt.Sprintf("/favorite/delete?_id=%s", res["_id"]), http.MethodDelete, nil, testTok2)
		assert.Equal(t, http.StatusForbidden, status, result["err"])
	}

	for _, res := range resultListTestUser {
		result, status = requester(fmt.Sprintf("/favorite/delete?_id=%s", res["_id"]), http.MethodDelete, nil, testTok)
		assert.Equal(t, http.StatusOK, status, result["err"])
	}

	for _, res := range resultListTestUser2 {
		result, status = requester(fmt.Sprintf("/favorite/delete?_id=%s", res["_id"]), http.MethodDelete, nil, testTok2)
		assert.Equal(t, http.StatusOK, status, result["err"])
	}
}
