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

func getTempCart(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getTempCart")

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

	if r.Form.Get("user") != "" && !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	} else if r.Form.Get("user") != "" {
		id, err := primitive.ObjectIDFromHex((r.Form.Get("user")))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid user").ToJson())
			return
		}

		query["user"] = id
	} else {
		query["user"] = user.ID
	}

	tempCart, err := database.FindTempCarts(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting tempCart").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tempCart)
}

func postTempCart(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postTempCart")

	tempCart := database.TempCart{}
	err := utils.ParseBody(r.Body, &tempCart)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	// Search if user already has a tempCart
	query := bson.M{"user": user.ID}
	cartToDelete, err := database.FindOneTempCart(ctx, query)
	if err == nil {
		// If tempCart exists, delete it
		_, err = cartToDelete.DeleteOne(ctx)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write(utils.NewResErr("Error deleting tempCart").ToJson())
			return
		}
	}

	tempCart.User = user.ID

	if tempCart.Quantity == nil || len(tempCart.Quantity) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing quantity").ToJson())
		return
	}

	if tempCart.Articles == nil || len(tempCart.Articles) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing articles").ToJson())
		return
	}

	if len(tempCart.Quantity) != len(tempCart.Articles) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Quantity and articles must have the same length").ToJson())
		return
	}

	resErr := utils.IsListObjectIdExist(tempCart.Articles, database.ArticleCollection)
	if resErr != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(resErr.ToJson())
		return
	}

	for i := 0; i < len(tempCart.Quantity); i++ {
		if tempCart.Quantity[i] <= 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Quantity must be greater than 0").ToJson())
			return
		}
	}

	_, err = tempCart.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("TempCart already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating tempCart").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tempCart)
}

func deleteTempCart(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteTempCart")

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing form").ToJson())
		return
	}

	query := bson.M{}
	if r.Form.Get("_id") != "" && !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	} else if r.Form.Get("_id") != "" {
		id, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid _id").ToJson())
			return
		}

		query["_id"] = id
	} else {
		query["user"] = user.ID
	}

	tempCart, err := database.FindOneTempCart(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting tempCart").ToJson())
		return
	}

	res, err := tempCart.DeleteOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting tempCart").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("TempCart not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("TempCart deleted").ToJson())
}
