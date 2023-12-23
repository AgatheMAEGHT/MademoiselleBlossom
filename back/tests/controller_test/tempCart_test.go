package controller_test

import (
	"MademoiselleBlossom/cron"
	"MademoiselleBlossom/database"
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestTempCart(t *testing.T) {
	testTok := createTestAccount(t, "test@tempcart.com")
	defer deleteAccount(t, testTok)

	// Post articles
	deferFunc, articles, _, _, _, _ := PostCompleteArticle(t)
	defer deferFunc()

	// Post tempCart
	tempCart := map[string]interface{}{
		"articles": []string{articles[0], articles[1]},
		"quantity": []int{1, 2},
	}

	result, status := requester("/temp-cart/create", http.MethodPost, tempCart, testTok)
	assert.Equal(t, 200, status, result["err"])

	// Get Article to check Stock
	resultList, status, err := requesterList("/article", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 3, len(resultList))
	assert.Equal(t, 9, int(resultList[0]["stock"].(float64)))
	assert.Equal(t, 18, int(resultList[1]["stock"].(float64)))

	// Delete tempCart
	result, status = requester("/temp-cart/delete", http.MethodDelete, nil, testTok)
	assert.Equal(t, 200, status, result["err"])

	// Get Article to check Stock
	resultList, status, err = requesterList("/article", http.MethodGet, nil, "")
	assert.Equal(t, 200, status, err)
	assert.Equal(t, 3, len(resultList))
	assert.Equal(t, 10, int(resultList[0]["stock"].(float64)))
	assert.Equal(t, 20, int(resultList[1]["stock"].(float64)))
}

func TestTempCartCron(t *testing.T) {
	ctx := context.Background()
	article := database.Article{
		Name:  "test",
		Stock: 10,
	}

	_, err := article.CreateOne(ctx)
	assert.NoError(t, err)

	tempCartOld := database.TempCart{
		User:      primitive.NewObjectID(),
		Articles:  []primitive.ObjectID{article.ID},
		Quantity:  []int{1},
		CreatedAt: primitive.NewDateTimeFromTime(time.Now().Add(-database.TempCartExpiration)),
	}

	_, err = database.TempCartCollection.InsertOne(ctx, tempCartOld)
	assert.NoError(t, err)

	tempCartNew := database.TempCart{
		User:     primitive.NewObjectID(),
		Articles: []primitive.ObjectID{article.ID},
		Quantity: []int{1},
	}

	_, err = tempCartNew.CreateOne(ctx)
	assert.NoError(t, err)

	cron.CleanTempCartTick()

	tempCarts, err := database.FindTempCarts(ctx, nil)
	assert.NoError(t, err)
	assert.Equal(t, 1, len(tempCarts))
	assert.Equal(t, tempCartNew.ID, tempCarts[0].ID)

	_, err = tempCartNew.DeleteOne(ctx)
	assert.NoError(t, err)
}
