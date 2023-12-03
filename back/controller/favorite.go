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

func getFavorite(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getFavorite")

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
	if r.Form.Get("article") != "" {
		id, err := utils.IsStringObjectIdValid(r.Form.Get("article"), database.ArticleCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid article").ToJson())
			return
		}

		query["article"] = id
	}
	query["user"] = user.ID

	favorites, err := database.FindFavorites(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting favorite").ToJson())
		return
	}

	if r.Form.Get("populate") == "true" {
		favoritesRes := make([]*database.FavoriteRes, 0)
		for _, favorite := range favorites {
			favoriteRes, err := favorite.Populate(ctx)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(utils.NewResErr("Error populating favorite").ToJson())
				return
			}
			favoritesRes = append(favoritesRes, favoriteRes)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(favoritesRes)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(favorites)
}

func postFavorite(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postFavorite")

	favorite := database.Favorite{}
	err := utils.ParseBody(r.Body, &favorite)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if favorite.Article == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing article").ToJson())
		return
	}
	errId := utils.IsObjectIdExist(favorite.Article, database.ArticleCollection)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(errId.ToJson())
		return
	}

	if favorite.User == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing user").ToJson())
		return
	}
	errId = utils.IsObjectIdExist(favorite.User, database.UserCollection)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(errId.ToJson())
		return
	}

	_, err = favorite.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Favorite already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating favorite").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(favorite)
}

func deleteFavorite(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteFavorite")

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

	res, err := database.DeleteOneFavorite(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting favorite").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("Favorite not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("Favorite deleted").ToJson())
}
