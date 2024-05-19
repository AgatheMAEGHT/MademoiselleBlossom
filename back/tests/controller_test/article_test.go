package controller_test

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func PostCompleteArticle(t *testing.T) (deferFunc func(), articles []string, colors []string, tones []string, shapes []string, species []string) {
	adminTok := getAdminAccessToken(t)

	// Post File
	result, status := requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	fileID, ok := result["_id"].(string)
	assert.True(t, ok)
	fileExt, ok := result["ext"].(string)
	assert.True(t, ok)
	assert.Equal(t, "jpg", fileExt)

	// Post ArticleShapes
	body := map[string]interface{}{
		"name": "test",
	}

	result, status = requester("/article-shape/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	shapes = append(shapes, result["_id"].(string))

	body = map[string]interface{}{
		"name": "test2",
	}

	result, status = requester("/article-shape/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	shapes = append(shapes, result["_id"].(string))

	// Post ArticleTones
	body = map[string]interface{}{
		"name": "test",
	}

	result, status = requester("/article-tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tones = append(tones, result["_id"].(string))

	body = map[string]interface{}{
		"name": "test2",
	}

	result, status = requester("/article-tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	tones = append(tones, result["_id"].(string))

	// Post colors
	body = map[string]interface{}{
		"name": "black",
		"hexa": "black",
	}

	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	body = map[string]interface{}{
		"name": "white",
		"hexa": "white",
	}

	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	body = map[string]interface{}{
		"name": "red",
		"hexa": "red",
	}

	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	colors = append(colors, result["_id"].(string))

	// Post article species
	body = map[string]interface{}{
		"name": "test",
	}
	result, status = requester("/article-species/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	species = append(species, result["_id"].(string))

	body = map[string]interface{}{
		"name": "test2",
	}
	result, status = requester("/article-species/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	species = append(species, result["_id"].(string))

	// Post article
	body = map[string]interface{}{
		"files":   []string{},
		"name":    "low",
		"price":   10,
		"stock":   10,
		"tones":   []string{tones[0]},
		"size":    10,
		"shape":   shapes[0],
		"type":    "test",
		"species": []string{species[0]},
		"colors":  []string{colors[0], colors[1]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID, ok := result["_id"].(string)
	assert.True(t, ok)
	articles = append(articles, resArticleID)

	body = map[string]interface{}{
		"files":   []string{},
		"name":    "mid",
		"price":   20,
		"stock":   20,
		"tones":   []string{tones[0], tones[1]},
		"size":    20,
		"shape":   shapes[0],
		"type":    "test",
		"species": []string{species[0], species[1]},
		"colors":  []string{colors[0]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID, ok = result["_id"].(string)
	assert.True(t, ok)
	articles = append(articles, resArticleID)

	body = map[string]interface{}{
		"files":   []string{fileID},
		"name":    "high",
		"price":   30,
		"stock":   30,
		"tones":   []string{tones[1]},
		"size":    30,
		"shape":   shapes[1],
		"type":    "test2",
		"species": []string{species[1]},
		"colors":  []string{colors[2]},
	}

	result, status = requester("/article/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleID, ok = result["_id"].(string)
	assert.True(t, ok)
	articles = append(articles, resArticleID)

	deferFunc = func() {
		// Delete articles
		for _, id := range articles {
			result, status = requester(fmt.Sprintf("/article/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete colors
		for _, id := range colors {
			result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete ArticleTones
		for _, id := range tones {
			result, status = requester(fmt.Sprintf("/article-tone/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete ArticleShapes
		for _, id := range shapes {
			result, status = requester(fmt.Sprintf("/article-shape/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete ArticleSpecies
		for _, id := range species {
			result, status = requester(fmt.Sprintf("/article-species/delete?_id=%s", id), http.MethodDelete, nil, adminTok)
			assert.Equal(t, 200, status, result["err"])
		}

		// Delete file
		result, status = requester(fmt.Sprintf("/file/delete/%s.%s", fileID, fileExt), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 400, status, result["err"])
	}

	return deferFunc, articles, colors, tones, shapes, species
}

func TestFilterArticle(t *testing.T) {
	deferFunc, _, colorsID, tones, shapes, species := PostCompleteArticle(t)
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

	// Filter by colors
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?colors=%s", colorsID[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?colors=%s&colors=%s", colorsID[1], colorsID[2]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	// Filter by type
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?types=%s", "test"), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?types=%s&types=%s", "test", "test2"), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))

	// Filter by shapes
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?shapes=%s", shapes[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?shapes=%s&shapes=%s", shapes[0], shapes[1]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))

	// Filter by tones
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?tones=%s", tones[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?tones=%s&tones=%s", tones[0], tones[1]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))

	// Filter by species
	resultList, status, resErr = requesterList(fmt.Sprintf("/article?species=%s", species[0]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 2, len(resultList))

	resultList, status, resErr = requesterList(fmt.Sprintf("/article?species=%s&species=%s", species[0], species[1]), http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))

	// Populate
	resultList, status, resErr = requesterList("/article?populate=true", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, resErr)
	assert.Equal(t, 3, len(resultList))
	assert.NotEmpty(t, resultList[0]["shape"])
	assert.NotEmpty(t, resultList[0]["type"])
	assert.NotEmpty(t, resultList[0]["tones"])
	assert.NotEmpty(t, resultList[0]["colors"])
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
		assert.Equal(t, 400, status, result["err"])
	}()

	result, status = requesterFile("/file/create", http.MethodPost, adminTok, "screenTest.png")
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resFileID2, ok := result["_id"].(string)
	assert.True(t, ok)
	resExt, ok = result["ext"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete file
		result, status = requester(fmt.Sprintf("/file/delete/%s.%s", resFileID2, resExt), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 400, status, result["err"])
	}()

	// Post article shape
	body := map[string]interface{}{
		"name": "test",
	}
	result, status = requester("/article-shape/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleShapeID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete article shape
		result, status = requester(fmt.Sprintf("/article-shape/delete?_id=%s", resArticleShapeID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post ArticleTone
	body = map[string]interface{}{
		"name": "test",
	}

	result, status = requester("/article-tone/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resArticleToneID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete ArticleTone
		result, status = requester(fmt.Sprintf("/article-tone/delete?_id=%s", resArticleToneID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post color
	body = map[string]interface{}{
		"name": "test",
		"hexa": "test",
	}

	result, status = requester("/article-color/create", http.MethodPost, body, adminTok)
	assert.Equal(t, 200, status, result["err"])
	assert.NotEmpty(t, result["_id"])
	resColorID, ok := result["_id"].(string)
	assert.True(t, ok)

	defer func() {
		// Delete color
		result, status = requester(fmt.Sprintf("/article-color/delete?_id=%s", resColorID), http.MethodDelete, nil, adminTok)
		assert.Equal(t, 200, status, result["err"])
	}()

	// Post article
	body = map[string]interface{}{
		"files":   []string{resFileID},
		"name":    "test",
		"price":   10,
		"stock":   10,
		"tones":   []string{resArticleToneID},
		"size":    10,
		"shape":   resArticleShapeID,
		"type":    "test",
		"colors":  []string{resColorID},
		"species": []string{},
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
		"files":   []string{resFileID2},
		"name":    "test2",
		"price":   10,
		"stock":   10,
		"tones":   []string{resArticleToneID},
		"size":    10,
		"shape":   resArticleShapeID,
		"type":    "test",
		"colors":  []string{resColorID},
		"species": []string{},
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
