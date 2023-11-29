package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleToneCollection *mongo.Collection
)

type ArticleTone struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *ArticleTone) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleToneCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleTone) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleToneCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneArticleTone(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleToneCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticleTone(ctx context.Context, filter bson.M) (*ArticleTone, error) {
	var a ArticleTone
	err := ArticleToneCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticleTones(ctx context.Context, filter bson.M) ([]*ArticleTone, error) {
	cursor, err := ArticleToneCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var articleTones []*ArticleTone
	for cursor.Next(ctx) {
		var a ArticleTone
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		articleTones = append(articleTones, &a)
	}

	return articleTones, nil
}

func initArticleTone(ctx context.Context, db *mongo.Database) {
	ArticleToneCollection = db.Collection("articleTones")

	ArticleToneCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
