package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func PostArticleFilter(t *testing.T) (deferFunc func(), colors []string, types []string, tones []string) {
	adminTok := getAdminAccessToken(t)

	// Post tones
	body := map[string]interface{}{
		"name": "test",
	}

	result, status := requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tones = append(tones, result["_id"].(string))

	body = map[string]interface{}{
		"name": "test2",
	}

	result, status = requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tones = append(tones, result["_id"].(string))

	// Post colors
	body = map[string]interface{}{
		"name": "black",
		"hexa": "000000",
	}

	result, status = requester("/color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	body = map[string]interface{}{
		"name": "white",
		"hexa": "ffffff",
	}

	result, status = requester("/color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	body = map[string]interface{}{
		"name": "red",
		"hexa": "ff0000",
	}

	result, status = requester("/color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	// Post Type
	body = map[string]interface{}{
		"name": "test",
	}
	result, status = requester("/article-type/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	types = append(types, result["_id"].(string))

	body = map[string]interface{}{
		"name": "test2",
	}
	result, status = requester("/article-type/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	types = append(types, result["_id"].(string))

	// Post article
	body = map[string]interface{}{
		"files":  []string{},
		"name":   "low",
		"price":  10,
		"stock":  10,
		"tones":  []string{tones[0]},
		"size":   10,
		"shape":  "square",
		"type":   types[0],
		"colors": []string{colors[0], colors[1]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID1, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"files":  []string{},
		"name":   "mid",
		"price":  20,
		"stock":  20,
		"tones":  []string{tones[0], tones[1]},
		"size":   20,
		"shape":  "square",
		"type":   types[0],
		"colors": []string{colors[0]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID2, ok := result["_id"].(string)
	assert.True(t, ok)

	body = map[string]interface{}{
		"files":  []string{},
		"name":   "high",
		"price":  30,
		"stock":  30,
		"tones":  []string{tones[1]},
		"size":   30,
		"shape":  "round",
		"type":   types[1],
		"colors": []string{colors[2]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID3, ok := result["_id"].(string)
	assert.True(t, ok)

	deferFunc = func() {
		// Delete articles
		for _, id := range []string{resArticleID1, resArticleID2, resArticleID3} {
			result, status = requester(fmt.Sprintf("/article/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete types
		for _, id := range types {
			result, status = requester(fmt.Sprintf("/article-type/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete colors
		for _, id := range colors {
			result, status = requester(fmt.Sprintf("/color/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete tones
		for _, id := range tones {
			result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}
	}

	return deferFunc, colors, types, tones
}

func TestFilterArticle(t *testing.T) {
	deferFunc, colorsID, types, tones := PostArticleFilter(t)
	defer deferFunc()

	// Get articles
	resultList, status, resErr := requesterList("/article", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))

	// Filter by price
	resultList, status, resErr = requesterList("/article?priceLow=15&priceHigh=25", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))
	assert.Equal(t, "mid", resultList[0]["name"])

	// Filter by size
	resultList, status, resErr = requesterList("/article?sizeLow=15&sizeHigh=25", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))
	assert.Equal(t, "mid", resultList[0]["name"])

	// Filter by shape
	resultList, status, resErr = requesterList("/article?shape=square", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	// Filter by colors
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?colors=%s", colorsID[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?colors=%s&colors=%s", colorsID[1], colorsID[2]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	// Filter by type
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?type=%s", types[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	// Filter by tones
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?tones=%s", tones[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?tones=%s&tones=%s", tones[0], tones[1]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))
}

func TestArticle(t *testing.T) {
	testTok := createTestAccount(t, "test@article.fr")
	defer deleteAccount(t, testTok)
	adminTok := getAdminAccessToken(t)

	// Post file
	// Admin
	result, status := requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resFileID, ok := result["_id"].(string)
	assert.True(t, ok)
	resExt, ok := result["ext"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete file
		result, status = requester(fmt.Sprintf("/file/delete/%s.%s", resFileID, resExt), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post article type
	body := map[string]interface{}{
		"name": "test",
	}
	result, status = requester("/article-type/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleTypeID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete article type
		result, status = requester(fmt.Sprintf("/article-type/delete?_id=%s", resArticleTypeID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post Tone
	body = map[string]interface{}{
		"name": "test",
	}

	result, status = requester("/tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resToneID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete Tone
		result, status = requester(fmt.Sprintf("/tone/delete?_id=%s", resToneID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post color
	body = map[string]interface{}{
		"name": "test",
		"hexa": "000000",
	}

	result, status = requester("/color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resColorID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete color
		result, status = requester(fmt.Sprintf("/color/delete?_id=%s", resColorID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post article
	body = map[string]interface{}{
		"files":  []string{resFileID},
		"name":   "test",
		"price":  10,
		"stock":  10,
		"tones":  []string{resToneID},
		"size":   10,
		"shape":  "test",
		"type":   resArticleTypeID,
		"colors": []string{resColorID},
	}
	// Not admin
	result, status = requester("/article/create", http.MethodPost, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// No file
	result, status = requester("/article/create", http.MethodPost, map[string]interface{}{"name": "test"}, adminTok)
	assert.Equal(t, 400, status, result["err"])

	// Admin
	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID1, ok := result["_id"].(string)
	assert.True(t, ok)

	// Post 2nd article
	body = map[string]interface{}{
		"files":  []string{resFileID},
		"name":   "test2",
		"price":  10,
		"stock":  10,
		"tones":  []string{resToneID},
		"size":   10,
		"shape":  "test",
		"type":   resArticleTypeID,
		"colors": []string{resColorID},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID2, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete article
		result, status = requester(fmt.Sprintf("/article/delete?_id=%s", resArticleID2), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Get articles
	resultList, status, resErr := requesterList("/article", http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))
	assert.NotEmpty(t, resultList[0]["_id"])

	// Get article
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?_id=%s", resArticleID1), http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))

	// Update article
	body = map[string]interface{}{
		"_id":  resArticleID1,
		"name": "test3",
	}

	// Not admin
	result, status = requester("/article/update", http.MethodPut, body, testTok)
	assert.Equal(t, 401, status, result["err"])

	// Admin
	result, status = requester("/article/update", http.MethodPut, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID3, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete article
		result, status = requester(fmt.Sprintf("/article/delete?_id=%s", resArticleID3), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Get article
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?_id=%s", resArticleID3), http.MethodGet, nil, testTok)
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 1, len(resultList))
	assert.Equal(t, "test3", resultList[0]["name"])
}
