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

func getArticleTone(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getArticleTone")

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

	articleTones, err := database.FindArticleTones(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article types").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleTones)
}

func postArticleTone(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleTone")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	articleTone := database.ArticleTone{}
	err := utils.ParseBody(r.Body, &articleTone)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if articleTone.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing name").ToJson())
		return
	}

	_, err = articleTone.CreateOne(ctx)
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
	json.NewEncoder(w).Encode(articleTone)
}

func putArticleTone(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleTone")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.ArticleTone{}
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

	articleTone, err := database.FindOneArticleTone(ctx, bson.M{"_id": body.ID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article type").ToJson())
		return
	}

	if body.Name != "" {
		articleTone.Name = body.Name
	}

	_, err = articleTone.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating article type").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(articleTone)
}

func deleteArticleTone(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postArticleTone")

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

	res, err := database.DeleteOneArticleTone(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting article type").ToJson())
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
