package main

import (
	"MademoiselleBlossom/controller"
	"MademoiselleBlossom/database"
	"context"
	"fmt"
	"os"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
)

func conf() {
	// Config logrus
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(logrus.Formatter(&logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
	}))
}

func createAdmin(ctx context.Context, user database.User) {
	log := logrus.WithContext(ctx)
	_, err := user.CreateOne(ctx)
	if mongo.IsDuplicateKeyError(err) {
		log.Info("User already exists")
	} else if err != nil {
		log.Fatal(err)
	}
}

func main() {
	conf()
	ctx := context.Background()
	log := logrus.WithContext(ctx)
	log.Info("Starting api")
	_, err := database.Connect(ctx, os.Getenv("MONGO_URL"))
	if err != nil {
		log.Fatal(err)
	}

	// Create admins
	admin := database.User{
		Email:     "quentinescudier@hotmail.fr",
		FirstName: "Quentin",
		LastName:  "Escudier",
		Phone:     "0610790767",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)
	admin = database.User{
		Email:     "agathe.maeght@gmail.com",
		FirstName: "Agathe",
		LastName:  "Maeght",
		Phone:     "0781996923",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)
	admin = database.User{
		Email:     "mademoiselle.blossom34@gmail.com",
		FirstName: "Mademoiselle",
		LastName:  "Blossom",
		Phone:     "0616282883",
		Password:  "admin",
		IsAdmin:   true,
	}
	createAdmin(ctx, admin)

	// Start server
	controller.StartServer(fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT")))
}
