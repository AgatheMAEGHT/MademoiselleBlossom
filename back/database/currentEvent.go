package database

import (
	"context"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	CurrentEventCollection *mongo.Collection
)

type CurrentEvent struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *CurrentEvent) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := CurrentEventCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *CurrentEvent) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return CurrentEventCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneCurrentEvent(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return CurrentEventCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func DeleteAllCurrentEvents(ctx context.Context) (*mongo.DeleteResult, error) {
	return CurrentEventCollection.DeleteMany(ctx, bson.M{})
}

func FindOneCurrentEvent(ctx context.Context, filter bson.M) (*CurrentEvent, error) {
	var a CurrentEvent
	err := CurrentEventCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindCurrentEvents(ctx context.Context, filter bson.M) ([]*CurrentEvent, error) {
	cursor, err := CurrentEventCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var currentEvents []*CurrentEvent
	for cursor.Next(ctx) {
		var a CurrentEvent
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		currentEvents = append(currentEvents, &a)
	}

	return currentEvents, nil
}

func initCurrentEvent(ctx context.Context, db *mongo.Database) {
	_ = ctx
	CurrentEventCollection = db.Collection("currentEvents")
}

func defaultCurrentEvents(ctx context.Context) {
	log := logrus.WithContext(ctx)
	currentEvents := []CurrentEvent{
		{Name: ""},
	}

	// Insert default current events only if none exists
	c, err := CurrentEventCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	if c > 0 {
		log.Debug("Current events already exist")
		return
	}

	for _, currentEvent := range currentEvents {
		_, err := currentEvent.CreateOne(ctx)
		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				log.Debug("Current event already exists")
			} else {
				log.Fatal(err)
			}
		}
	}
}
