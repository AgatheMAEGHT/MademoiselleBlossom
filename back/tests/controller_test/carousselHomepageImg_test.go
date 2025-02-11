package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCarousselHomepageImg(t *testing.T) {
	testTok := createTestAccount(t, "test@carousselhomepageimg.fr")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// get default number of carousselHomepageImg
	resultList, status, resErr := requesterList("/caroussel-homepage-img", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	nbCarousselHomepageImg := len(resultList)

	// Post file
	// Admin
	result, status := requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resFileID, ok := result["_id"].(string)
	assert.True(t, ok)

	result, status = requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resFileID2, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post carousselHomepageImg
	body := map[string]interface{}{
		"file":    resFileID,
		"altName": "test",
	}
	// Not admin
	result, status = requester("/caroussel-homepage-img/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// No file
	result, status = requester("/caroussel-homepage-img/create", http.MethodPost, map[string]interface{}{"altName": "test"}, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Admin
	result, status = requester("/caroussel-homepage-img/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resCarousselID1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post 2nd carousselHomepageImg
	body = map[string]interface{}{
		"file":    resFileID2,
		"altName": "test2",
	}
	result, status = requester("/caroussel-homepage-img/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resCarousselID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete carousselHomepageImg
		// Admin
		result, status = requester(fmt.Sprintf("/caroussel-homepage-img/delete?_id=%s", resCarousselID2), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Get carousselHomepageImgs
	resultList, status, resErr = requesterList("/caroussel-homepage-img", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2+nbCarousselHomepageImg, len(resultList))
	assert.NotEmpty(t, resultList[0]["_id"])

	// Get carousselHomepageImg
	resultList, status, resErr = requesterList(fmt.Sprintf("/caroussel-homepage-img?_id=%s", resCarousselID1), http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))

	// Update carousselHomepageImg
	body = map[string]interface{}{
		"_id":     resCarousselID1,
		"altName": "test3",
	}

	// Not admin
	result, status = requester("/caroussel-homepage-img/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/caroussel-homepage-img/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resCarousselID3, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete carousselHomepageImg
		// Admin
		result, status = requester(fmt.Sprintf("/caroussel-homepage-img/delete?_id=%s", resCarousselID3), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Get carousselHomepageImg
	resultList, status, resErr = requesterList(fmt.Sprintf("/caroussel-homepage-img?_id=%s", resCarousselID3), http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))
	assert.Equal(t, "test3", resultList[0]["altName"])
}
