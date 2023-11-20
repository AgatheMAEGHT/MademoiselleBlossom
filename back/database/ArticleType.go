package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	ArticleTypeCollection *mongo.Collection
)

type ArticleType struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *ArticleType) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleTypeCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleType) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleTypeCollection.UpdateOne(ctx, primitive.M{"_id": a.ID}, primitive.M{"$set": a})
}

