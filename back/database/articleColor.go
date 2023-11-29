package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleColorCollection *mongo.Collection
)

type ArticleColor struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
	Hexa string             `json:"hexa" bson:"hexa"`
}

func (a *ArticleColor) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleColorCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleColor) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleColorCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneColor(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleColorCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticleColor(ctx context.Context, filter bson.M) (*ArticleColor, error) {
	var a ArticleColor
	err := ArticleColorCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticleColors(ctx context.Context, filter bson.M) ([]*ArticleColor, error) {
	cursor, err := ArticleColorCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var colors []*ArticleColor
	for cursor.Next(ctx) {
		var a ArticleColor
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		colors = append(colors, &a)
	}

	return colors, nil
}

func initArticleColor(ctx context.Context, db *mongo.Database) {
	ArticleColorCollection = db.Collection("colors")

	ArticleColorCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})

	ArticleColorCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"hexa": 1},
		Options: options.Index().SetUnique(true),
	})
}
