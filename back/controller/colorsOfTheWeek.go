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

func getColorsOfTheWeek(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getColorsOfTheWeek")

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
	if r.Form.Get("hexa") != "" {
		query["hexa"] = r.Form.Get("hexa")
	}

	colors, err := database.FindColorsOfTheWeeks(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting colors of the week").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(colors)
}

func postColorsOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postColorsOfTheWeek")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	color := database.ColorsOfTheWeek{}
	err := utils.ParseBody(r.Body, &color)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if color.Hexas == nil || len(color.Hexas) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing hexa").ToJson())
		return
	}

	_, err = color.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Colors of the week already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating colors of the week").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(color)
}

func putColorsOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("putColorsOfTheWeek")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.ColorsOfTheWeek{}
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

	color, err := database.FindOneColorsOfTheWeek(ctx, bson.M{"_id": body.ID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting colors of the week").ToJson())
		return
	}

	if body.Hexas != nil && len(body.Hexas) > 0 {
		color.Hexas = body.Hexas
	}

	_, err = color.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating colors of the week").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(color)
}

func deleteColorsOfTheWeek(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteColorsOfTheWeek")

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

	res, err := database.DeleteOneColor(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting colors of the week").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("Colors of the week type not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Colors of the week type deleted").ToJson())
}
