package controller

import (
	"MademoiselleBlossom/database"
	"MademoiselleBlossom/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getArticle(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getArticle")

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing form").ToJson())
		return
	}

	query := bson.M{}
	if r.Form.Get("_id") != "" {
		id, err := primitive.ObjectIDFromHex((r.Form.Get("_id")))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid _id").ToJson())
			return
		}

		query["_id"] = id
	}

	if r.Form.Get("name") != "" {
		query["name"] = r.Form.Get("name")
	}

	if r.Form.Get("size") != "" {
		size, err := strconv.ParseFloat(r.Form.Get("size"), 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid size").ToJson())
			return
		}

		query["size"] = size
	}

	if r.Form.Get("shape") != "" {
		query["shape"] = r.Form.Get("shape")
	}

	sortPriceQuery := bson.M{}
	if r.Form.Get("priceLow") != "" {
		priceLow, err := strconv.ParseFloat(r.Form.Get("priceLow"), 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid priceLow").ToJson())
			return
		}

		sortPriceQuery["$gte"] = priceLow
	}
	if r.Form.Get("priceHigh") != "" {
		priceHigh, err := strconv.ParseFloat(r.Form.Get("priceHigh"), 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid priceHigh").ToJson())
			return
		}

		sortPriceQuery["$lte"] = priceHigh
	}

	if len(sortPriceQuery) > 0 {
		query["price"] = sortPriceQuery
	}

	sortSizeQuery := bson.M{}
	if r.Form.Get("sizeLow") != "" {
		sizeLow, err := strconv.ParseFloat(r.Form.Get("sizeLow"), 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid sizeLow").ToJson())
			return
		}

		sortSizeQuery["$gte"] = sizeLow
	}
	if r.Form.Get("sizeHigh") != "" {
		sizeHigh, err := strconv.ParseFloat(r.Form.Get("sizeHigh"), 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid sizeHigh").ToJson())
			return
		}

		sortSizeQuery["$lte"] = sizeHigh
	}

	if len(sortSizeQuery) > 0 {
		query["size"] = sortSizeQuery
	}

	if r.Form.Get("colors") != "" {
		colors, err := utils.IsStringListObjectIdValid(r.Form["colors"], database.ArticleColorCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}

		query["colors"] = bson.M{"$in": colors}
	}

	if r.Form.Get("tones") != "" {
		tones, err := utils.IsStringListObjectIdValid(r.Form["tones"], database.ArticleToneCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}

		query["tones"] = bson.M{"$in": tones}
	}

	if r.Form.Get("types") != "" {

		query["type"] = bson.M{"$in": r.Form["types"]}
	}

	if r.Form.Get("species") != "" {
		log.Error("species")
		species, err := utils.IsStringListObjectIdValid(r.Form["species"], database.ArticleSpeciesCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}

		query["species"] = bson.M{"$in": species}
	}

	if r.Form.Get("shapes") != "" {
		articleShape, err := utils.IsStringListObjectIdValid(r.Form["shapes"], database.ArticleShapeCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}

		query["shape"] = bson.M{"$in": articleShape}
	}

	queryOptions := options.Find()
	queryOptions.SetLimit(10)
	if r.Form.Get("limit") != "" {
		limit, err := strconv.Atoi(r.Form.Get("limit"))
		if err != nil || limit < 0 || limit > 100 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid limit").ToJson())
			return
		}

		queryOptions.SetLimit(int64(limit))
	}

	if r.Form.Get("page") != "" {
		page, err := strconv.Atoi(r.Form.Get("page"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid page").ToJson())
			return
		}

		queryOptions.SetSkip(int64(page * int(*queryOptions.Limit)))
	}

	articles, err := database.FindArticles(ctx, query, queryOptions)
	if err != nil && err != mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article").ToJson())
		return
	}

	if r.Form.Get("populate") == "true" {
		populatedArticles := make([]*database.ArticleRes, len(articles))
		var err error
		for i := range articles {
			populatedArticles[i], err = articles[i].Populate(ctx)
			if err != nil {
				log.WithError(err).Error("Error populating article")
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(utils.NewResErr("Error populating article").ToJson())
				return
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(populatedArticles)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articles)
}

func postArticle(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticle")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.Article{}
	err := utils.ParseBody(r.Body, &body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if body.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing name").ToJson())
		return
	}

	if body.Description == "" {
		log.Infof("Article '%s' has no description", body.Name)
	}

	if body.Files == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing files").ToJson())
		return
	}
	if err := utils.IsListObjectIdExist(body.Files, database.FileCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}
	log.Infof("Article '%s' has files: %v", body.Name, body.Files)

	if body.Tones == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing ArticleTones").ToJson())
		return
	}
	if err := utils.IsListObjectIdExist(body.Tones, database.ArticleToneCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.Colors == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing colors").ToJson())
		return
	}
	if err := utils.IsListObjectIdExist(body.Colors, database.ArticleColorCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.Type == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing article type").ToJson())
		return
	}

	if body.Shape == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing article shape").ToJson())
		return
	}
	if err := utils.IsObjectIdExist(body.Shape, database.ArticleShapeCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.Price == 0 {
		log.Infof("Article '%f' has no price", body.Price)
	}

	if body.Stock == 0 {
		log.Infof("Article '%d' has no stock", body.Stock)
	}

	if body.Size == 0 {
		log.Infof("Article '%f' has no size", body.Size)
	}

	_, err = body.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Article already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating article").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(body)
}

func putArticle(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticle")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.Article{}
	err := utils.ParseBody(r.Body, &body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if body.ID == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing _id").ToJson())
		return
	}

	article, err := database.FindOneArticle(ctx, bson.M{"_id": body.ID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article").ToJson())
		return
	}

	if body.Name != "" {
		article.Name = body.Name
	}

	if body.Description != "" {
		article.Description = body.Description
	}

	if body.Files != nil {
		if err := utils.IsListObjectIdExist(body.Files, database.FileCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Files = body.Files
	}

	if body.Tones != nil {
		if err := utils.IsListObjectIdExist(body.Tones, database.ArticleToneCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Tones = body.Tones
	}

	if body.Colors != nil {
		if err := utils.IsListObjectIdExist(body.Colors, database.ArticleColorCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Colors = body.Colors
	}

	if body.Type != "" {
		article.Type = body.Type
	}

	if body.Shape != primitive.NilObjectID {
		if err := utils.IsObjectIdExist(body.Shape, database.ArticleShapeCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Shape = body.Shape
	}

	if body.Price != 0 {
		article.Price = body.Price
	}

	if body.Size != 0 {
		article.Size = body.Size
	}

	_, err = article.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating article").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(article)
}

func deleteArticle(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticle")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing form").ToJson())
		return
	}

	if r.Form.Get("_id") == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing _id").ToJson())
		return
	}

	id, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	// Delete all files associated with the article
	article, err := database.FindOneArticle(ctx, bson.M{"_id": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article").ToJson())
		return
	}

	for _, fileID := range article.Files {
		file, err := database.FindOneFile(ctx, bson.M{"_id": fileID})
		if err != nil {
			log.WithError(err).Error("Error getting file")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error getting file").ToJson())
			return
		}

		err = os.Remove(fmt.Sprintf("%s/%s/%s.%s", database.FileFolder, file.Type, file.ID.Hex(), file.Ext))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error deleting file").ToJson())
			return
		}

		_, err = database.DeleteOneFile(ctx, fileID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error deleting file").ToJson())
			return
		}
	}

	// Delete all favorites associated with the article
	favorites, err := database.FindFavorites(ctx, bson.M{"article": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting favorites").ToJson())
		return
	}

	for _, favorite := range favorites {
		_, err = database.DeleteOneFavorite(ctx, favorite.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error deleting favorite").ToJson())
			return
		}
	}

	res, err := database.DeleteOneArticle(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("Article type not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Article type deleted").ToJson())
}
