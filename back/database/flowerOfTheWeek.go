package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	FlowerOfTheWeekCollection *mongo.Collection
)

type FlowerOfTheWeekRes struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Article *ArticleRes        `json:"article" bson:"article"`
}

type FlowerOfTheWeek struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Article primitive.ObjectID `json:"article" bson:"article"`
}

func (a *FlowerOfTheWeek) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := FlowerOfTheWeekCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *FlowerOfTheWeek) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return FlowerOfTheWeekCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneFlowerOfTheWeek(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return FlowerOfTheWeekCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneFlowerOfTheWeek(ctx context.Context, filter bson.M) (*FlowerOfTheWeek, error) {
	var a FlowerOfTheWeek
	err := FlowerOfTheWeekCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindFlowerOfTheWeeks(ctx context.Context, filter bson.M, opts ...*options.FindOptions) ([]*FlowerOfTheWeek, error) {
	cursor, err := FlowerOfTheWeekCollection.Find(ctx, filter, opts...)
	if err != nil {
		return nil, err
	}

	var flowerOfTheWeeks []*FlowerOfTheWeek
	for cursor.Next(ctx) {
		var a FlowerOfTheWeek
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		flowerOfTheWeeks = append(flowerOfTheWeeks, &a)
	}

	return flowerOfTheWeeks, nil
}

func (a *FlowerOfTheWeek) Populate(ctx context.Context) (*FlowerOfTheWeekRes, error) {
	var flowerOfTheWeekRes FlowerOfTheWeekRes
	flowerOfTheWeekRes.ID = a.ID

	article, err := FindOneArticle(ctx, bson.M{"_id": a.Article})
	if err != nil {
		return nil, err
	}
	articleRes, err := article.Populate(ctx)
	if err != nil {
		return nil, err
	}
	flowerOfTheWeekRes.Article = articleRes

	return &flowerOfTheWeekRes, nil
}

func initFlowerOfTheWeek(ctx context.Context, db *mongo.Database) {
	_ = ctx
	FlowerOfTheWeekCollection = db.Collection("flowersOfTheWeek")
}
