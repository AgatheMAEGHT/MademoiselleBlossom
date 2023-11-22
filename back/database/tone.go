package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ToneCollection *mongo.Collection
)

type Tone struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *Tone) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ToneCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Tone) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ToneCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneTone(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ToneCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneTone(ctx context.Context, filter bson.M) (*Tone, error) {
	var a Tone
	err := ToneCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindTones(ctx context.Context, filter bson.M) ([]*Tone, error) {
	cursor, err := ToneCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var tones []*Tone
	for cursor.Next(ctx) {
		var a Tone
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		tones = append(tones, &a)
	}

	return tones, nil
}

func initTone(ctx context.Context, db *mongo.Database) {
	ToneCollection = db.Collection("tones")

	ToneCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
