package cron

import (
	"MademoiselleBlossom/database"
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
)

func RemoveUnusedFilesTick() {
	ctx := context.Background()
	log := logrus.WithContext(ctx).WithFields(logrus.Fields{
		"cron": "removeUnusedFiles",
	})
	log.Info("Tick")

	// Create a map of all the files to mark them as used
	// The filemap is filed based on disk files
	fileToDeleteMap := make(map[string]bool)

	filesOnDisk, err := os.ReadDir(fmt.Sprintf("%s/%s", database.FileFolder, database.FileTypeImage))
	if err != nil {
		log.Error(err)
		return
	}

	for _, file := range filesOnDisk {
		nameCuted := strings.Split(file.Name(), ".")
		if len(nameCuted) != 2 {
			log.Errorf("Invalid file name %s", file.Name())
			continue
		}
		fileToDeleteMap[nameCuted[0]] = false
	}

	// First verify that every file on disk is referenced in the database
	files, err := database.FindFiles(ctx, nil)
	if err != nil {
		log.Error(err)
		return
	}

	for _, file := range files {
		if _, exists := fileToDeleteMap[file.ID.Hex()]; !exists {
			log.Infof("File %s on disk not found in database", file.ID.Hex())
			fileToDeleteMap[file.ID.Hex()] = true
		}
	}

	// Then verify that every file in the database is linked to an article or carousel
	for _, file := range files {
		if !fileToDeleteMap[file.ID.Hex()] {
			articles, err := database.FindArticles(ctx, bson.M{"files": file.ID})
			if err != nil {
				log.Error(err)
				continue
			}

			if len(articles) == 0 {
				carousels, err := database.FindCarousselHomepageImgs(ctx, bson.M{"file": file.ID})
				if err != nil {
					log.Error(err)
					continue
				}

				if len(carousels) == 0 {
					log.Infof("File %s not linked to any article or carousel", file.ID.Hex())
					fileToDeleteMap[file.ID.Hex()] = true
				}
			}
		}
	}

	// This function is a dry run, we only log the files that would be deleted
	for fileID, toDelete := range fileToDeleteMap {
		if toDelete {
			log.Infof("File %s would be deleted", fileID)
		}
	}
}
