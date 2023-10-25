package main

import (
	"MademoiselleBlossom/database"
	"context"
	"os"

	"github.com/sirupsen/logrus"
)

func conf() {
	// Config logrus
	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(logrus.Formatter(&logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
	}))
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
}
