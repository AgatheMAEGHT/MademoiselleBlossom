package controller

import (
	"MademoiselleBlossom/database"
	"MademoiselleBlossom/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func getCarousselHomepageImg(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("getCarousselHomepageImg")

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
	if r.Form.Get("altName") != "" {
		query["altName"] = r.Form.Get("altName")
	}
	if r.Form.Get("file") != "" {
		fileID, err := primitive.ObjectIDFromHex((r.Form.Get("file")))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Invalid file").ToJson())
			return
		}

		query["file"] = fileID
	}

	carousselHomepageImgs, err := database.FindCarousselHomepageImgs(ctx, query)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting carousselHomepageImg").ToJson())
		return
	}

	if r.Form.Get("populate") == "true" {
		populatedCarousselHomepageImgs := make([]*database.CarousselHomepageImgRes, len(carousselHomepageImgs))
		for i, carousselHomepageImg := range carousselHomepageImgs {
			populatedCarousselHomepageImgs[i], err = carousselHomepageImg.Populate(ctx)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(utils.NewResErr("Error populating carousselHomepageImg").ToJson())
				return
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(populatedCarousselHomepageImgs)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(carousselHomepageImgs)
}

func postCarousselHomepageImg(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postCarousselHomepageImg")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	carousselHomepageImg := database.CarousselHomepageImg{}
	err := utils.ParseBody(r.Body, &carousselHomepageImg)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Error parsing body").ToJson())
		return
	}

	if carousselHomepageImg.AltName == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing altName").ToJson())
		return
	}

	if carousselHomepageImg.File == primitive.NilObjectID {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing file").ToJson())
		return
	}

	if err := utils.IsObjectIdExist(carousselHomepageImg.File, database.FileCollection); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(err.ToJson())
		return
	}

	_, err = carousselHomepageImg.CreateOne(ctx)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("CarousselHomepageImg already exists").ToJson())
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error creating carousselHomepageImg").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(carousselHomepageImg)
}

func putCarousselHomepageImg(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postCarousselHomepageImg")

	if !user.IsAdmin {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Unauthorized").ToJson())
		return
	}

	body := database.CarousselHomepageImg{}
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

	carousselHomepageImg, err := database.FindOneCarousselHomepageImg(ctx, bson.M{"_id": body.ID})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting carousselHomepageImg").ToJson())
		return
	}

	if body.AltName != "" {
		carousselHomepageImg.AltName = body.AltName
	}

	if body.File != primitive.NilObjectID {
		err := utils.IsObjectIdExist(body.File, database.FileCollection)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(err.ToJson())
			return
		}
		carousselHomepageImg.File = body.File
	}

	_, err = carousselHomepageImg.UpdateOne(ctx)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error updating carousselHomepageImg").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(carousselHomepageImg)
}

func deleteCarousselHomepageImg(w http.ResponseWriter, r *http.Request, user database.User) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("postCarousselHomepageImg")

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

	// Delete all files associated with the carousselHomepageImg
	caroussel, err := database.FindOneCarousselHomepageImg(ctx, bson.M{"_id": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting caroussel homepage img").ToJson())
		return
	}

	file, err := database.FindOneFile(ctx, bson.M{"_id": caroussel.File})
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

	_, err = database.DeleteOneFile(ctx, caroussel.File)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error deleting file").ToJson())
		return
	}

	res, err := database.DeleteOneCarousselHomepageImg(ctx, id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error getting carousselHomepageImg").ToJson())
		return
	}

	if res.DeletedCount == 0 {
		w.WriteHeader(http.StatusNotFound)
		w.Write(utils.NewResErr("CarousselHomepageImg type not found").ToJson())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(utils.NewResMsg("CarousselHomepageImg type deleted").ToJson())
}
