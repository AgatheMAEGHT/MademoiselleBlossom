package cron

import (
	"MademoiselleBlossom/database"
	"context"
	"time"

	"github.com/sirupsen/logrus"
)

func CleanTempCartTick() {
	ctx := context.Background()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"cron": "cleanTempCart",
	})
	log.Info("Tick")

	tempCarts, err := database.FindTempCarts(ctx, nil)
	if err != nil {
		log.Error(err)
		return
	}

	nbOfDeleted := 0
	nbOfError := 0
	for _, tempCart := range tempCarts {
		if tempCart.CreatedAt.Time().Add(database.TempCartExpiration * time.Second).Before(time.Now()) {
			_, err := tempCart.DeleteOne(ctx)
			if err != nil {
				log.Error(err)
				nbOfError++
			}
			nbOfDeleted++
		}
	}

	log.Infof("Deleted %d tempCarts", nbOfDeleted)
	if nbOfError > 0 {
		log.Errorf("Error deleting %d tempCarts", nbOfError)
	}
}
