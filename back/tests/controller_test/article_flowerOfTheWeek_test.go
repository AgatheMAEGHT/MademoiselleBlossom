package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestFlowerOfTheWeek(t *testing.T) {
	deferFunc, articles, _, _, _, _ := PostCompleteArticle(t)
	defer deferFunc()

	testTok := createTestAccount(t, "test@floweroftheweek.com")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Get color number
	resultList, status, err := requesterList("/flower-of-the-week", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	nbFlowerOfTheWeek := len(resultList)

	// Post color
	body := map[string]interface{}{
		"article": articles[0],
	}

	// Not logged
	result, status := requester("/flower-of-the-week/create", http.MethodPost, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/flower-of-the-week/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin

	// Article does not exists
	result, status = requester("/flower-of-the-week/create", http.MethodPost, map[string]interface{}{"article": "663cc93c7e0f35b58378bd09"}, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// First success
	result, status = requester("/flower-of-the-week/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post a second flower of the week to test get
	body["article"] = articles[1]
	result, status = requester("/flower-of-the-week/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	res2, ok := result["_id"].(string)
	assert.True(t, ok)

	// Put article of the week
	body = map[string]interface{}{
		"_id":     res1,
		"article": articles[1],
	}

	// Not logged
	result, status = requester("/flower-of-the-week/update", http.MethodPut, body, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester("/flower-of-the-week/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/flower-of-the-week/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["article"])
	resArticle, ok := result["article"].(string)
	assert.True(t, ok)
	assert.Equal(t, body["article"], resArticle)

	// Get flowers of the week
	resultList, status, err = requesterList("/flower-of-the-week", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 2+nbFlowerOfTheWeek, len(resultList), resultList)

	// Populate
	resultList, status, resErr := requesterList("/flower-of-the-week?populate=true", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2+nbFlowerOfTheWeek, len(resultList))

	article := resultList[0]["article"].(map[string]interface{})
	assert.NotEmpty(t, article["shape"])
	assert.NotEmpty(t, article["type"])
	assert.NotEmpty(t, article["tones"])
	assert.NotEmpty(t, article["colors"])

	// Delete flower of the week

	// Not logged
	result, status = requester(fmt.Sprintf("/flower-of-the-week/delete?_id=%s", res1), http.MethodDelete, nil, "")
	assert.Equal(t, 401, status, result["err"])

	// Not admin
	result, status = requester(fmt.Sprintf("/flower-of-the-week/delete?_id=%s", res1), http.MethodDelete, nil, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester(fmt.Sprintf("/flower-of-the-week/delete?_id=%s", res1), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])

	result, status = requester(fmt.Sprintf("/flower-of-the-week/delete?_id=%s", res2), http.MethodDelete, nil, adminTok)
	assert.Equal(t, 200, status, result["err"])
}
