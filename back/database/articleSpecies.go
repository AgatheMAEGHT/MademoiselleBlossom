package database

import (
	"context"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleSpeciesCollection *mongo.Collection
)

type ArticleSpecies struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *ArticleSpecies) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleSpeciesCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleSpecies) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleSpeciesCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneArticleSpecies(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleSpeciesCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticleSpecies(ctx context.Context, filter bson.M) (*ArticleSpecies, error) {
	var a ArticleSpecies
	err := ArticleSpeciesCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticleSpecies(ctx context.Context, filter bson.M) ([]*ArticleSpecies, error) {
	cursor, err := ArticleSpeciesCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var articleSpecies []*ArticleSpecies
	for cursor.Next(ctx) {
		var a ArticleSpecies
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		articleSpecies = append(articleSpecies, &a)
	}

	return articleSpecies, nil
}

func initArticleSpecies(ctx context.Context, db *mongo.Database) {
	ArticleSpeciesCollection = db.Collection("articleSpecies")

	ArticleSpeciesCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultArticleSpecies(ctx context.Context) {
	log := logrus.WithContext(ctx)
	articleSpecies := []ArticleSpecies{
		{Name: "Rose"},
		{Name: "Orchidée"},
		{Name: "Lilas"},
		{Name: "Œillet"},
	}

	for _, articleSpecies := range articleSpecies {
		_, err := articleSpecies.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debug("Article Shape already exists")
			} else {
				log.Fatal(err)
			}
		}
	}
}
