package controller

import (
	"MademoiselleBlossom/database"
	"MademoiselleBlossom/utils"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type authToken struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

var (
	accessTokenTime  = time.Hour * 1
	refreshTokenTime = time.Hour * 24 * 7
	secret           = []byte(os.Getenv("SECRET_KEY"))
)

func generateAccessToken(user database.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.ID.Hex()
	claims["exp"] = time.Now().Add(accessTokenTime).Unix()
	return token.SignedString(secret)
}

func verifyAccessToken(ctx context.Context, tokenString string) (database.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})
	if err != nil {
		return database.User{}, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return database.User{}, fmt.Errorf("invalid token")
	}

	id, err := primitive.ObjectIDFromHex(claims["id"].(string))
	if err != nil {
		return database.User{}, err
	}

	user, err := database.FindOneUser(ctx, bson.M{"_id": id})
	if err != nil {
		return database.User{}, err
	}

	return user, nil
}

func generateRefreshToken(user database.User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.ID.Hex()
	claims["exp"] = time.Now().Add(refreshTokenTime).Unix()
	return token.SignedString(secret)
}

func verifyRefreshToken(ctx context.Context, tokenString string) (database.User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})
	if err != nil {
		return database.User{}, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return database.User{}, fmt.Errorf("invalid token")
	}

	id, err := primitive.ObjectIDFromHex(claims["id"].(string))
	if err != nil {
		return database.User{}, err
	}

	user, err := database.FindOneUser(ctx, bson.M{"_id": id})
	if err != nil {
		return database.User{}, err
	}

	return user, nil
}

func login(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("login")

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	mapBody := make(map[string]string)
	err := utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}

	if mapBody["email"] == "" || mapBody["password"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing email or password").ToJson())
		return
	}

	user, err := database.FindOneUser(r.Context(), bson.M{"email": mapBody["email"]})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Wrong email or password").ToJson())
		return
	}

	err = user.ComparePassword(mapBody["password"])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Wrong email or password").ToJson())
		return
	}

	accessToken, err := generateAccessToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to login").ToJson())
		return
	}

	refreshToken, err := generateRefreshToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to login").ToJson())
		return
	}

	returnToken := authToken{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    int(accessTokenTime.Seconds()),
		RefreshToken: refreshToken,
	}

	b, err := json.MarshalIndent(returnToken, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to login").ToJson())
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func refresh(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("refresh")

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	mapBody := make(map[string]string)
	err := utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}

	if mapBody["refresh_token"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing refresh token").ToJson())
		return
	}

	user, err := verifyRefreshToken(ctx, mapBody["refresh_token"])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(utils.NewResErr("Invalid refresh token").ToJson())
		return
	}

	accessToken, err := generateAccessToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to login").ToJson())
		return
	}

	returnToken := authToken{
		AccessToken: accessToken,
		TokenType:   "Bearer",
		ExpiresIn:   int(accessTokenTime.Seconds()),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(returnToken)
}

func register(w http.ResponseWriter, r *http.Request) {
	log := logrus.WithContext(r.Context()).WithFields(logrus.Fields{
		"method": r.Method,
		"path":   r.URL.Path,
	})
	log.Info("register")

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(utils.NewResErr("Method not allowed").ToJson())
		return
	}

	resBody, err := io.ReadAll(r.Body)
	if err != nil {
		log.Errorf("Failed to read body: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	mapBody := make(map[string]string)
	err = json.Unmarshal(resBody, &mapBody)
	if err != nil {
		log.Errorf("Failed to unmarshal body: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Error while parsing body").ToJson())
		return
	}

	if mapBody["email"] == "" || mapBody["password"] == "" || mapBody["firstName"] == "" || mapBody["lastName"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(utils.NewResErr("Missing email or password or firstName or lastName").ToJson())
		return
	}

	user := database.User{
		Email:     mapBody["email"],
		FirstName: mapBody["firstName"],
		LastName:  mapBody["lastName"],
		Password:  mapBody["password"],
		Phone:     mapBody["phone"],
	}

	_, err = user.CreateOne(r.Context())
	if err != nil {
		log.Errorf("Failed to create user: %v", err)
		if mongo.IsDuplicateKeyError(err) {
			w.WriteHeader(http.StatusBadRequest)
			w.Write(utils.NewResErr("Email already exists").ToJson())
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to register").ToJson())
		return
	}

	// Create token
	accessToken, err := generateAccessToken(user)
	if err != nil {
		log.Errorf("Failed to generate access token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to register").ToJson())
		return
	}

	refreshToken, err := generateRefreshToken(user)
	if err != nil {
		log.Errorf("Failed to generate refresh token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(utils.NewResErr("Failed to register").ToJson())
		return
	}

	returnToken := authToken{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    int(accessTokenTime.Seconds()),
		RefreshToken: refreshToken,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(returnToken)
}
