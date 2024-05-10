package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ColorsOfTheWeekCollection *mongo.Collection
)

type ColorsOfTheWeekRes struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Hexas     []string           `json:"hexas" bson:"hexas"`
	CreatedAt primitive.DateTime `json:"createdAt" bson:"createdAt"`
}

type ColorsOfTheWeek struct {
	ID        primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Hexas     []string             `json:"hexas" bson:"hexas"`
	CreatedAt primitive.DateTime   `json:"createdAt" bson:"createdAt"`
}

func (a *ColorsOfTheWeek) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	a.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	res, err := ColorsOfTheWeekCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ColorsOfTheWeek) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ColorsOfTheWeekCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneColorsOfTheWeek(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ColorsOfTheWeekCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneColorsOfTheWeek(ctx context.Context, filter bson.M) (*ColorsOfTheWeek, error) {
	var a ColorsOfTheWeek
	err := ColorsOfTheWeekCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindColorsOfTheWeeks(ctx context.Context, filter bson.M, options ...*options.FindOptions) ([]*ColorsOfTheWeek, error) {
	cursor, err := ColorsOfTheWeekCollection.Find(ctx, filter, options...)
	if err != nil {
		return nil, err
	}

	var colorsOfTheWeeks []*ColorsOfTheWeek
	for cursor.Next(ctx) {
		var a ColorsOfTheWeek
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		colorsOfTheWeeks = append(colorsOfTheWeeks, &a)
	}

	return colorsOfTheWeeks, nil
}

func (a *ColorsOfTheWeek) Populate(ctx context.Context) (*ColorsOfTheWeekRes, error) {
	var colorsOfTheWeekRes ColorsOfTheWeekRes
	colorsOfTheWeekRes.ID = a.ID
	colorsOfTheWeekRes.Hexas = a.Hexas

	colorsOfTheWeekRes.CreatedAt = a.CreatedAt

	return &colorsOfTheWeekRes, nil
}

func initColorsOfTheWeek(ctx context.Context, db *mongo.Database) {
	_ = ctx
	ColorsOfTheWeekCollection = db.Collection("colorsOfTheWeeks")
}
