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

func getArticleType(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getArticleType")

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

	articleTypes, err := database.FindArticleTypes(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article types").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleTypes)
}

func postArticleType(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleType")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := map[string]interface{}{}
	err := utils.ParseBody(r.Body, &body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if body["name"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing name").ToJson())
		return
	}

	articleType := database.ArticleType{
		Name: body["name"].(string),
	}

	_, err = articleType.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Article type already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating article type").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleType)
}

func putArticleType(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleType")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := map[string]interface{}{}
	err := utils.ParseBody(r.Body, &body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if body["_id"] == nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing _id").ToJson())
		return
	}

	idStr, ok := body["_id"].(string)
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	articleType, err := database.FindOneArticleType(ctx, bson.M{"_id": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article type").ToJson())
		return
	}

	if body["name"] != nil {
		articleType.Name = body["name"].(string)
	}

	_, err = articleType.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating article type").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleType)
}

func deleteArticleType(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleType")

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

	id, err := primitive.ObjectIDFromHex((r.Form.Get("_id")))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid _id").ToJson())
		return
	}

	articleType, err := database.FindOneArticleType(ctx, bson.M{"_id": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article type").ToJson())
		return
	}

	_, err = articleType.DeleteOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting article type").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleType)
}
