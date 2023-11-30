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
	ArticleShapeCollection *mongo.Collection
)

type ArticleShape struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *ArticleShape) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleShapeCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleShape) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleShapeCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneArticleShape(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleShapeCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticleShape(ctx context.Context, filter bson.M) (*ArticleShape, error) {
	var a ArticleShape
	err := ArticleShapeCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticleShapes(ctx context.Context, filter bson.M) ([]*ArticleShape, error) {
	cursor, err := ArticleShapeCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var articleShapes []*ArticleShape
	for cursor.Next(ctx) {
		var a ArticleShape
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		articleShapes = append(articleShapes, &a)
	}

	return articleShapes, nil
}

func initArticleShape(ctx context.Context, db *mongo.Database) {
	ArticleShapeCollection = db.Collection("articleShapes")

	ArticleShapeCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}

func defaultArticleShapes(ctx context.Context) {
	log := logrus.WithContext(ctx)
	articleShapes := []ArticleShape{
		{Name: "Rond"},
		{Name: "Coeur"},
	}

	for _, articleShape := range articleShapes {
		_, err := articleShape.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debug("Article Shape already exists")
			} else if err != nil {
				log.Fatal(err)
			}
		}
	}
}
