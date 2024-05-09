package controller

import (
	"MademoiselleBlossom/database"
	"MademoiselleBlossom/utils"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getFlowerOfTheWeek(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getFlowerOfTheWeek")

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

	flowerOfTheWeeks, err := database.FindFlowerOfTheWeeks(ctx, query, queryOptions)
	if err != nil && err != mongo.ErrNoDocuments {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting flowerOfTheWeek").ToJson())
		return
	}

	if r.Form.Get("populate") == "true" {
		populatedFlowerOfTheWeeks := make([]*database.FlowerOfTheWeekRes, len(flowerOfTheWeeks))
		var err error
		for i := range flowerOfTheWeeks {
			populatedFlowerOfTheWeeks[i], err = flowerOfTheWeeks[i].Populate(ctx)
			if err != nil {
				log.WithError(err).Error("Error populating flowerOfTheWeek")
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(utils.NewResErr("Error populating flowerOfTheWeek").ToJson())
				return
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(populatedFlowerOfTheWeeks)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(flowerOfTheWeeks)
}

func postFlowerOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postFlowerOfTheWeek")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.FlowerOfTheWeek{}
	err := utils.ParseBody(r.Body, &body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if body.Article == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing article").ToJson())
		return
	}

	if err := utils.IsObjectIdExist(body.Article, database.ArticleCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Invalid article").ToJson())
		return
	}

	_, err = body.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("FlowerOfTheWeek already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating flowerOfTheWeek").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(body)
}

func putFlowerOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postFlowerOfTheWeek")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.FlowerOfTheWeek{}
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

	flowerOfTheWeek, err := database.FindOneFlowerOfTheWeek(ctx, bson.M{"_id": body.ID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting flowerOfTheWeek").ToJson())
		return
	}

	if body.Article != primitive.NilObjectID {
		if err := utils.IsObjectIdExist(body.Article, database.ArticleCollection); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid article").ToJson())
			return
		}

		flowerOfTheWeek.Article = body.Article
	}

	_, err = flowerOfTheWeek.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating flowerOfTheWeek").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(flowerOfTheWeek)
}

func deleteFlowerOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postFlowerOfTheWeek")

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

	res, err := database.DeleteOneFlowerOfTheWeek(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting flowerOfTheWeek").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("FlowerOfTheWeek type not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("FlowerOfTheWeek type deleted").ToJson())
}
