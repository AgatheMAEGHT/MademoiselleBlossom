package controller

import (
	"MademoiselleBlossom/database"
	"MademoiselleBlossom/utils"
	"encoding/json"
	"net/http"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	articles, err := database.FindArticles(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article").ToJson())
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

	if body.Tones == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing tones").ToJson())
		return
	}
	if err := utils.IsListObjectIdExist(body.Tones, database.ToneCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.Colors == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing colors").ToJson())
		return
	}
	if err := utils.IsListObjectIdExist(body.Colors, database.ColorCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.ArticleType == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing article type").ToJson())
		return
	}
	if err := utils.IsObjectIdExist(body.ArticleType, database.ArticleTypeCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	if body.Price == 0 {
		log.Infof("Article '%s' has no price", body.Name)
	}

	if body.Stock == 0 {
		log.Infof("Article '%s' has no stock", body.Name)
	}

	if body.Size == 0 {
		log.Infof("Article '%s' has no size", body.Name)
	}

	if body.Shape == "" {
		log.Infof("Article '%s' has no shape", body.Name)
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

	if body.Files != nil {
		if err := utils.IsListObjectIdExist(body.Files, database.FileCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Files = body.Files
	}

	if body.Tones != nil {
		if err := utils.IsListObjectIdExist(body.Tones, database.ToneCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Tones = body.Tones
	}

	if body.Colors != nil {
		if err := utils.IsListObjectIdExist(body.Colors, database.ColorCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.Colors = body.Colors
	}

	if body.ArticleType != primitive.NilObjectID {
		if err := utils.IsObjectIdExist(body.ArticleType, database.ArticleTypeCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		article.ArticleType = body.ArticleType
	}

	if body.Price != 0 {
		article.Price = body.Price
	}

	if body.Size != 0 {
		article.Size = body.Size
	}

	if body.Shape != "" {
		article.Shape = body.Shape
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
