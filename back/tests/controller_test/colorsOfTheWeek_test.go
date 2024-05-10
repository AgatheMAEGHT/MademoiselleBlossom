package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestColorsOfTheWeek(t *testing.T) {
	testTok := createTestAccount(t, "test@colorsoftheweek.fr")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Get num colors of the week
	resultList, status, err := requesterList("/colors-of-the-week", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	nbColorsOfTheWeek := len(resultList)

	// Create color of the week
	colorOfTheWeek := map[string]interface{}{
		"hexas": []string{"test", "test2"},
	}
	// Not admin
	result, status := requester("/colors-of-the-week/create", http.MethodPost, colorOfTheWeek, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/colors-of-the-week/create", http.MethodPost, colorOfTheWeek, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resColorsOfTheWeekID1, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete color of the week
		// Admin
		result, status = requester(fmt.Sprintf("/colors-of-the-week/delete?_id=%s", resColorsOfTheWeekID1), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Get num colors of the week
	resultList, status, err = requesterList("/colors-of-the-week", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, nbColorsOfTheWeek+1, len(resultList))
}
