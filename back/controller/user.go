package controller

import (
	"MademoiselleBlossom/database"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func whoAmI(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("whoAmI")

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("{err: 'Method not allowed'}"))
		return
	}

	b, err := json.MarshalIndent(user, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("{err: 'Failed to login'}"))
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func deleteAccount(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("deleteAccount")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("{err: 'Method not allowed'}"))
		return
	}

	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("{err: 'Bad request'}"))
		return
	}

	userToDelete := user

	if r.Form.Get("_id") != "" {
		if !user.IsAdmin {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{err: 'Unauthorized'}"))
			return
		}

		userID, err := primitive.ObjectIDFromHex(r.Form.Get("_id"))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("{err: 'Wrong ID format'}"))
			return
		}
		userToDelete, err = database.FindOneUser(ctx, bson.M{"_id": userID})
		if err != nil {
			if err == mongo.ErrNoDocuments {
				http.Error(w, fmt.Sprintf("{err: 'User %s not found'}", userID), http.StatusNotFound)
				return
			}

			log.Error(err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	_, err = userToDelete.DeleteOne(ctx)
	if err != nil {
		log.Error(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("{msg: 'User deleted'}"))
}
