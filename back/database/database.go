package database

import (
	"context"
	"fmt"
	"os"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	// db is the database instance
	db *mongo.Database
)

func createAdmin(ctx context.Context, user User) {
	log := logrus.WithContext(ctx)
	_, err := user.CreateOne(ctx)
	if mongo.IsDuplicateKeyError(err) {
		log.Debug("User already exists")
	} else if err != nil {
		log.Fatal(err)
	}
}

func addAdmins(ctx context.Context) {
	// Create admins
	admin := User{
		Email:     "quentinescudier@hotmail.fr",
		FirstName: "Quentin",
		LastName:  "Escudier",
		Phone:     "0610790767",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)
	admin = User{
		Email:     "agathe.maeght@gmail.com",
		FirstName: "Agathe",
		LastName:  "Maeght",
		Phone:     "0781996923",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)
	admin = User{
		Email:     "mademoiselle.blossom34@gmail.com",
		FirstName: "Mademoiselle",
		LastName:  "Blossom",
		Phone:     "0616282883",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)
}

func Connect(ctx context.Context, url string) (*mongo.Client, error) {
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"package":  "database",
		"function": "Connect",
	})
	if os.Getenv("MONGO_INITDB_ROOT_USERNAME") == "" {
		return nil, fmt.Errorf("MONGO_INITDB_ROOT_USERNAME is not set")
	}
	if os.Getenv("MONGO_INITDB_ROOT_PASSWORD") == "" {
		return nil, fmt.Errorf("MONGO_INITDB_ROOT_PASSWORD is not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(url), options.Client().SetAuth(options.Credential{
		Username: os.Getenv("MONGO_INITDB_ROOT_USERNAME"),
		Password: os.Getenv("MONGO_INITDB_ROOT_PASSWORD"),
	}))
	if err != nil {
		return nil, err
	}
	log.Info("Connected to database")

	db = client.Database("MademoiselleBlossom")

	// Init collections
	initUser(ctx, db)
	initArticleType(ctx, db)
	initColor(ctx, db)

	// Add admins
	addAdmins(ctx)

	return client, nil
}
