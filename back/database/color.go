package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ColorCollection *mongo.Collection
)

type Color struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
	Hexa string             `json:"hexa" bson:"hexa"`
}

func (a *Color) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ColorCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Color) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ColorCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneColor(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ColorCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneColor(ctx context.Context, filter bson.M) (*Color, error) {
	var a Color
	err := ColorCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindColors(ctx context.Context, filter bson.M) ([]*Color, error) {
	cursor, err := ColorCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var colors []*Color
	for cursor.Next(ctx) {
		var a Color
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		colors = append(colors, &a)
	}

	return colors, nil
}

func initColor(ctx context.Context, db *mongo.Database) {
	ColorCollection = db.Collection("colors")

	ColorCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})

	ColorCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"hexa": 1},
		Options: options.Index().SetUnique(true),
	})
}
