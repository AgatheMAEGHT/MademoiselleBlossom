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
		w.Write([]byte(`{"err": "Method not allowed"}`))
		return
	}

	mapBody := make(map[string]string)
	err := utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Error while parsing body"}`))
		return
	}

	if mapBody["email"] == "" || mapBody["password"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"err": "Missing email or password"}`))
		return
	}

	user, err := database.FindOneUser(r.Context(), bson.M{"email": mapBody["email"]})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Wrong email or password"}`))
		return
	}

	err = user.ComparePassword(mapBody["password"])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"err": "Wrong email or password"}`))
		return
	}

	accessToken, err := generateAccessToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to login"}`))
		return
	}

	refreshToken, err := generateRefreshToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to login"}`))
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
		w.Write([]byte(`{"err": "Failed to login"}`))
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
		w.Write([]byte(`{"err": "Method not allowed"}`))
		return
	}

	mapBody := make(map[string]string)
	err := utils.ParseBody(r.Body, &mapBody)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Error while parsing body"}`))
		return
	}

	if mapBody["refresh_token"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"err": "Missing refresh token"}`))
		return
	}

	user, err := verifyRefreshToken(ctx, mapBody["refresh_token"])
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"err": "Invalid refresh token"}`))
		return
	}

	accessToken, err := generateAccessToken(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to login"}`))
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
		w.Write([]byte(`{"err": "Method not allowed"}`))
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
		w.Write([]byte(`{"err": "Error while parsing body"}`))
		return
	}

	if mapBody["email"] == "" || mapBody["password"] == "" || mapBody["firstName"] == "" || mapBody["lastName"] == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"err": "Missing email or password or firstName or lastName"}`))
		return
	}

	user := database.User{
		Email:     mapBody["email"],
		FirstName: mapBody["firstName"],
		LastName:  mapBody["lastName"],
		Password:  mapBody["password"],
	}

	_, err = user.CreateOne(r.Context())
	if err != nil {
		log.Errorf("Failed to create user: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to register"}`))
		return
	}

	// Create token
	accessToken, err := generateAccessToken(user)
	if err != nil {
		log.Errorf("Failed to generate access token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to register"}`))
		return
	}

	refreshToken, err := generateRefreshToken(user)
	if err != nil {
		log.Errorf("Failed to generate refresh token: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"err": "Failed to register"}`))
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
